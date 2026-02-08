import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PORT = Number(process.env.PORT || 8787);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const normalizeOrigin = (origin) => String(origin).trim().replace(/\/$/, '').toLowerCase();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasWildcard = (value) => value.includes('*');

const wildcardToRegex = (pattern) => {
  const escaped = escapeRegex(pattern).replace(/\\\*/g, '.*');
  return new RegExp(`^${escaped}$`, 'i');
};

const allowedOrigins = CORS_ORIGIN
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOriginChecker = (requestOrigin, callback) => {
  // Non-browser requests can proceed (health checks, curl, internal calls).
  if (!requestOrigin) {
    callback(null, true);
    return;
  }

  if (allowedOrigins.includes('*')) {
    callback(null, true);
    return;
  }

  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
  let requestHost = '';
  try {
    requestHost = new URL(normalizedRequestOrigin).host;
  } catch {
    requestHost = '';
  }

  const match = allowedOrigins.some((allowedOrigin) => {
    const normalizedAllowedOrigin = normalizeOrigin(allowedOrigin);
    if (normalizedAllowedOrigin === normalizedRequestOrigin) {
      return true;
    }

    if (hasWildcard(normalizedAllowedOrigin)) {
      // Full-origin wildcard patterns (e.g. https://*.vercel.app)
      if (normalizedAllowedOrigin.startsWith('http://') || normalizedAllowedOrigin.startsWith('https://')) {
        return wildcardToRegex(normalizedAllowedOrigin).test(normalizedRequestOrigin);
      }
      // Host-only wildcard patterns (e.g. *.vercel.app)
      if (!requestHost) return false;
      return wildcardToRegex(normalizedAllowedOrigin).test(requestHost);
    }

    // Allows host-only values (e.g. my-gain.vercel.app) in CORS_ORIGIN.
    if (!normalizedAllowedOrigin.startsWith('http://') && !normalizedAllowedOrigin.startsWith('https://')) {
      return requestHost === normalizedAllowedOrigin;
    }

    return false;
  });

  callback(null, match);
};

app.use(cors({ origin: corsOriginChecker }));
app.use(express.json({ limit: '1mb' }));

const roleLabelBySubRole = {
  admin: 'Admin',
  vendas: 'Vendas',
  logistica: 'Logística',
  financeiro: 'Financeiro',
  rh: 'RH',
  infraestrutura: 'Infraestrutura'
};

const subRoleByLabel = {
  Admin: 'admin',
  Vendas: 'vendas',
  Logística: 'logistica',
  Financeiro: 'financeiro',
  RH: 'rh',
  Infraestrutura: 'infraestrutura'
};

const normalizeSubRole = (input) => {
  if (!input) return null;
  if (subRoleByLabel[input]) return subRoleByLabel[input];
  const normalized = String(input).trim().toLowerCase();
  const allowed = Object.keys(roleLabelBySubRole);
  if (allowed.includes(normalized)) return normalized;
  return null;
};

const isRecentlyOnline = (lastSignInAt) => {
  if (!lastSignInAt) return false;
  const last = new Date(lastSignInAt).getTime();
  if (Number.isNaN(last)) return false;
  const diffMinutes = (Date.now() - last) / 60000;
  return diffMinutes <= 15;
};

const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing bearer token' });
    }

    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const authUser = userData.user;
    const { data: cargo, error: cargoError } = await adminClient
      .from('cargos')
      .select('role, sub_role')
      .eq('supabase_id', authUser.id)
      .maybeSingle();

    if (cargoError) {
      return res.status(500).json({ error: 'Failed to load roles' });
    }

    if (!cargo || cargo.role !== 'colaborador' || cargo.sub_role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.authUser = authUser;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Unexpected auth error' });
  }
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/users', requireAdmin, async (_req, res) => {
  try {
    const users = [];
    let page = 1;
    const perPage = 200;

    for (;;) {
      const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const batch = data?.users ?? [];
      users.push(...batch);

      if (batch.length < perPage) break;
      page += 1;
    }

    const userIds = users.map((user) => user.id);
    const { data: cargos, error: cargosError } = await adminClient
      .from('cargos')
      .select('supabase_id, role, sub_role')
      .in('supabase_id', userIds);

    if (cargosError) {
      return res.status(500).json({ error: cargosError.message });
    }

    const cargoById = new Map((cargos ?? []).map((cargo) => [cargo.supabase_id, cargo]));

    const results = users
      .map((user) => {
        const cargo = cargoById.get(user.id);
        if (!cargo || cargo.role !== 'colaborador') {
          return null;
        }

        const subRole = cargo.sub_role;
        return {
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Sem Nome',
          email: user.email || '',
          subRole,
          roleLabel: roleLabelBySubRole[subRole] || 'Sem Cargo',
          status: isRecentlyOnline(user.last_sign_in_at) ? 'online' : 'offline',
          createdAt: user.created_at
        };
      })
      .filter(Boolean);

    res.json({ users: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list users' });
  }
});

app.post('/users', requireAdmin, async (req, res) => {
  try {
    const { name, email, password, subRole } = req.body || {};
    const normalizedSubRole = normalizeSubRole(subRole);

    if (!name || !email || !password || !normalizedSubRole) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (error || !data?.user) {
      return res.status(500).json({ error: error?.message || 'Failed to create user' });
    }

    const userId = data.user.id;

    const { error: cargoError } = await adminClient
      .from('cargos')
      .insert({
        supabase_id: userId,
        role: 'colaborador',
        sub_role: normalizedSubRole
      });

    if (cargoError) {
      await adminClient.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: cargoError.message });
    }

    res.status(201).json({
      user: {
        id: userId,
        name,
        email,
        subRole: normalizedSubRole,
        roleLabel: roleLabelBySubRole[normalizedSubRole],
        status: 'offline',
        createdAt: data.user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.patch('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, subRole } = req.body || {};

    const normalizedSubRole = normalizeSubRole(subRole);

    const updatePayload = {};
    if (email) updatePayload.email = email;
    if (password) updatePayload.password = password;
    if (name) updatePayload.user_metadata = { full_name: name };

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await adminClient.auth.admin.updateUserById(id, updatePayload);
      if (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (normalizedSubRole) {
      const { error: cargoError } = await adminClient
        .from('cargos')
        .upsert({
          supabase_id: id,
          role: 'colaborador',
          sub_role: normalizedSubRole
        });

      if (cargoError) {
        return res.status(500).json({ error: cargoError.message });
      }
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await adminClient.auth.admin.deleteUser(id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
