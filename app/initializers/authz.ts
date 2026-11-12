import { abilities, ability, type Access, allow, definePolicy, fact } from "@sdxc/authz"
import { unwrap } from "@sdxc/result"
import type { SessionUser } from "~/app/initializers/auth"
import type { UserRole } from "~/database/schema"

export const paartAbilities = abilities({
  admin: {
    access: ability({ description: "Access the PAART Admin Console (/admin/*)" }),
    manageUsers: ability({ description: "Provision, suspend, and reset user accounts" }),
    manageBatches: ability({ description: "Create and assign coaching batches" })
  },
  lms: {
    teach: ability({
      description:
        "Access Faculty Workspace (/faculty/*) to manage exams, marks, syllabus, and alerts"
    }),
    portal: ability({
      description:
        "Access Aspirant Portal (/portal/*) to view personal progress, marks, and materials"
    }),
    viewEnrolledMaterials: ability({
      description: "Download or view enrolled-visibility study materials"
    })
  }
})

export const paartPolicy = definePolicy(paartAbilities, {
  facts: {
    actor: fact<{ id: string; role: UserRole }>({ optional: true })
  },
  roles: {
    aspirant: [allow(["lms.portal", "lms.viewEnrolledMaterials"])],
    faculty: [allow(["lms.teach", "lms.viewEnrolledMaterials"])],
    admin: {
      inherits: ["faculty"],
      grants: [allow("*")]
    }
  }
})

declare module "@sdxc/authz" {
  interface AuthzTypes {
    policy: typeof paartPolicy
  }
}

export function bindUserAccess(user: SessionUser | null): Access {
  const bound = paartPolicy.for({
    roles: user && user.status === "active" ? [user.role] : [],
    facts: user ? { actor: { id: user.id, role: user.role } } : {}
  })
  return unwrap(bound)
}

export async function canRoleAccessWorkspace(
  user: SessionUser | null,
  workspace: "admin" | "faculty" | "portal"
): Promise<boolean> {
  if (!user || user.status !== "active") return false
  const access = bindUserAccess(user)
  await access.load(paartAbilities)

  switch (workspace) {
    case "admin":
      return access.can(paartAbilities.admin.access)
    case "faculty":
      return access.can(paartAbilities.lms.teach)
    case "portal":
      return access.can(paartAbilities.lms.portal) && user.role === "aspirant"
  }
}
