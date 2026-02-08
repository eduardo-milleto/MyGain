import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for tests');
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function ensureTestUser(email: string, password: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    await adminClient.auth.admin.deleteUser(existing.id);
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error || !data?.user) {
    throw new Error(`Failed to create test user: ${error?.message ?? 'unknown error'}`);
  }

  return data.user.id;
}

export async function ensureErpAdminUser(email: string, password: string) {
  const userId = await ensureTestUser(email, password);

  const { error } = await adminClient
    .from('cargos')
    .upsert({
      supabase_id: userId,
      role: 'colaborador',
      sub_role: 'admin'
    });

  if (error) {
    await adminClient.auth.admin.deleteUser(userId);
    throw new Error(`Failed to assign ERP admin role: ${error.message}`);
  }

  return userId;
}

export async function cleanupTestUser(email: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    await adminClient.auth.admin.deleteUser(existing.id);
  }
}

async function findUserByEmail(email: string) {
  let page = 1;
  const perPage = 200;

  for (;;) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`Failed to list users: ${error.message}`);
    }

    const users = data?.users ?? [];
    const match = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;

    if (users.length < perPage) break;
    page += 1;
  }

  return null;
}
