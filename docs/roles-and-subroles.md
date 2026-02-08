# Roles and Sub-Roles (MyGain)

This document explains how **roles** and **sub-roles** work in the MyGain platform, how they are stored in Supabase, and how the frontend enforces access.

## 1. Source of truth: Supabase table `cargos`

Roles are stored in `public.cargos` and linked 1:1 with the Supabase Auth user.

Table schema (see migration `supabase/migrations/20260208_000001_create_cargos.sql`):

- `supabase_id` (UUID) — **Primary Key**, references `auth.users(id)`
- `role` — **top-level role** (`cliente` | `colaborador`)
- `sub_role` — **fine-grained role** (depends on `role`)
- `created_at`, `updated_at`

RLS policy allows a user to read only their own role row.

## 2. Role model (business rules)

### 2.1 Top-level roles

- `cliente`
  - **Cannot access ERP**
  - Can access Agents & Courses (depending on `sub_role`)

- `colaborador`
  - **Cannot access Agents & Courses**
  - Can access ERP modules (depending on `sub_role`)

### 2.2 Sub-roles by role

#### `colaborador` sub-roles

- `admin` — access to all ERP modules
- `vendas` — CRM only
- `rh` — Users only
- `financeiro` — Finance only
- `logistica` — Email only
- `infraestrutura` — Email only

#### `cliente` sub-roles

- `cursos` — Courses only
- `agentes` — Configure Agent + GPT Traders
- `cursos_agentes` — Configure Agent + GPT Traders + Courses

## 3. Frontend enforcement

Frontend logic is in:
- `frontend/src/app/contexts/AuthContext.tsx`

The flow is:
1. User logs in via Supabase Auth.
2. Frontend queries `public.cargos` by `supabase_id`.
3. Role and sub-role are mapped into the user session.
4. UI and navigation are locked/unlocked using `hasPermission()`.

### Key permission rules

- `erp` is **only** available to `colaborador`
- `agents` (Agents & Courses) is **only** available to `cliente`
- ERP modules are controlled by `employeePermissions`
- Agents/Courses modules are controlled by `clientPermissions`

## 4. Example records

### Example: Collaborator (Admin)

```sql
insert into public.cargos (supabase_id, role, sub_role)
values ('<auth_user_id>', 'colaborador', 'admin');
```

### Example: Collaborator (Finance)

```sql
insert into public.cargos (supabase_id, role, sub_role)
values ('<auth_user_id>', 'colaborador', 'financeiro');
```

### Example: Client (Courses only)

```sql
insert into public.cargos (supabase_id, role, sub_role)
values ('<auth_user_id>', 'cliente', 'cursos');
```

### Example: Client (Courses + Agents)

```sql
insert into public.cargos (supabase_id, role, sub_role)
values ('<auth_user_id>', 'cliente', 'cursos_agentes');
```

## 5. Important notes

- If a user exists in `auth.users` but has **no row** in `cargos`, they will **not** get access to any module.
- The frontend expects `role` and `sub_role` to be **valid strings** as listed above. Any other value will result in no permissions.
- Use the Supabase SQL Editor or `psql` with a direct connection to insert/update role data.

## 6. Direct connection (AI / automation)

When using AI or automation to manage roles, always use a **direct connection** to the database.

### 6.1 Connection string

```
postgresql://postgres:Mygain192947@db.uedmnujfqqwzntezeita.supabase.co:5432/postgres
```

### 6.2 SSL certificate

Supabase requires SSL. Use one of the following:

- **Full SSL** (recommended):
  - Set `sslmode=verify-full` and provide the CA certificate.
- **Simpler SSL**:
  - `sslmode=require`

Example (full SSL, with CA file):

```bash
psql "postgresql://postgres:Mygain192947@db.uedmnujfqqwzntezeita.supabase.co:5432/postgres?sslmode=verify-full&sslrootcert=/path/to/supabase-ca.crt"
```

Example (require SSL only):

```bash
psql "postgresql://postgres:Mygain192947@db.uedmnujfqqwzntezeita.supabase.co:5432/postgres?sslmode=require"
```

If you download the Supabase CA certificate, store it securely and do **not** commit it to git.
