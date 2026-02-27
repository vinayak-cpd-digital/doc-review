export type UserRole = "reviewer" | "approver";

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

interface Credential {
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

const CREDENTIALS: Credential[] = [
  {
    email: "ankith.v@copperpoddigital.com",
    password: "passwd",
    role: "reviewer",
    name: "Ankith V",
  },
  {
    email: "pallavi.m@copperpoddigital.com",
    password: "passwd",
    role: "approver",
    name: "Pallavi M",
  },
];

export function authenticate(
  email: string,
  password: string
): User | null {
  const match = CREDENTIALS.find(
    (c) =>
      c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  if (!match) return null;
  return { email: match.email, role: match.role, name: match.name };
}
