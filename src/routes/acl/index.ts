export enum Roles {
  ADMINISTRADOR = 'ADMINISTRADOR',
  USUARIO = 'USUARIO'
}

type Role = keyof typeof Roles

export const SYSTEM_ROLES: { [key: string]: Role } = {
  administrador: Roles.ADMINISTRADOR,
  usuario: Roles.USUARIO
}

export const defaultAcl: Record<Role, { allow: boolean }> = {
  ADMINISTRADOR: { allow: true },
  USUARIO: { allow: false }
}

type Acl = typeof defaultAcl

export const isAllowed = ({
  acl,
  systemRole
}: {
  path: string
  acl: Acl
  systemRole: string
}): boolean => {
  if (!SYSTEM_ROLES[systemRole]) {
    return false
  }

  const role = SYSTEM_ROLES[systemRole]
  return acl[role].allow
}
