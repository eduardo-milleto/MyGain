# Test Users - MyGain System

## User Types

### Employees (ERP Access)

1. Admin (Full Access)
- Email: `admin@mygain.com`
- Password: any (development only)
- Permissions: CRM, Users, Finance, Email

2. Sales
- Email: `sales@mygain.com`
- Password: any (development only)
- Permissions: CRM, Email

3. Finance
- Email: `finance@mygain.com`
- Password: any (development only)
- Permissions: Finance, Email

4. HR
- Email: `hr@mygain.com` (not created yet, use admin)
- Password: any (development only)
- Permissions: Users, Email

5. Logistics
- Email: `logistics@mygain.com` (not created yet, use admin)
- Password: any (development only)
- Permissions: Email

6. Infrastructure
- Email: `infrastructure@mygain.com` (not created yet, use admin)
- Password: any (development only)
- Permissions: Email

---

### Clients (No ERP Access)

1. Full Client
- Email: `client@company.com`
- Password: any (development only)
- Permissions: Courses, Configure Agent, GPT Traders

2. Courses Only Client
- Email: `client2@company.com`
- Password: any (development only)
- Permissions: Courses only

---

## Permissions Model

### Main Dashboard
- Employees: See `ERP` and `Agents & Courses`
- Clients: See `Agents & Courses` only (ERP locked)

### ERP Modules (Employees)
- Admin: All modules
- Sales: CRM + Email
- Finance: Finance + Email
- HR: Users + Email
- Logistics: Email
- Infrastructure: Email

### Agents & Courses (Clients)
- Full Client: All modules (Courses, Configure Agent, GPT Traders)
- Courses Only: Courses only (others locked)

---

## Locked State UI

When a module is locked:
- Lock icon in the top-right corner
- 40% opacity
- `not-allowed` cursor
- No hover effects
- `Locked` label in the ERP footer
- Click disabled

---

## How to Test

1. Log in with one of the emails above
2. Verify available modules
3. Observe lock behavior
4. Log out and test another user type

---

## Technical Notes

- Permissions are defined in `src/app/contexts/AuthContext.tsx`
- Backend must enforce the same rules
- Password is not validated in development
