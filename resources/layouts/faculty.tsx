import type { Handle, RemixNode } from "remix/component"
import {
  BellIcon,
  ClipboardCheckIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ShieldCheckIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Avatar, Badge, Button, Link, Text } from "@sdxc/ui"
import { AppShell } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import { ThemeToggle } from "~/resources/components/theme-toggle"
import { routes } from "~/routes"

export interface FacultyLayoutProps {
  user: SessionUser
  currentPath: string
  children?: RemixNode
}

const FACULTY_SHELL_LABELS: AppShell.Labels = {
  nav: "Faculty Workspace Navigation",
  skip: "Skip to content",
  menu: "Open navigation menu",
  close: "Close navigation",
  collapse: "Toggle sidebar"
}

const FACULTY_NAV_ITEMS = [
  { label: "Batches & Syllabus", href: routes.faculty.index.href(), icon: LayoutDashboardIcon },
  { label: "Exams & Scorecards", href: routes.faculty.exams.href(), icon: ClipboardCheckIcon },
  { label: "Study Materials", href: routes.faculty.materials.href(), icon: FileTextIcon },
  { label: "Notifications", href: routes.faculty.notifications.href(), icon: BellIcon }
]

export function FacultyLayout(handle: Handle<FacultyLayoutProps>) {
  return () => {
    const { user, currentPath, children } = handle.props
    const initial = (user.name[0] || user.email[0] || "F").toUpperCase()

    return (
      <AppShell
        id="paart-faculty-shell"
        labels={FACULTY_SHELL_LABELS}
        peek
        workspace={
          <Link
            href={routes.faculty.index.href()}
            mix={[u.textDecoration("none"), u.fg("inherit"), u.block()]}
          >
            <AppShell.Identity
              chevron={false}
              avatar={
                <img
                  src="/images/paart-logo.png"
                  alt="PAART"
                  width={24}
                  height={26}
                  decoding="async"
                />
              }
              name="PAART Academy"
              detail="Faculty Workspace"
            />
          </Link>
        }
        nav={
          <div mix={[u.vstack({ gap: 4 })]}>
            <AppShell.Group title="Academic Operations">
              {FACULTY_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isCurrent =
                  item.href === "/faculty"
                    ? currentPath === "/faculty" || currentPath.startsWith("/faculty/batches/")
                    : currentPath.startsWith(item.href)
                return (
                  <AppShell.Item
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    current={isCurrent}
                    icon={<Icon size={16} />}
                  />
                )
              })}
            </AppShell.Group>

            {user.role === "admin" && (
              <AppShell.Group title="Administration">
                <AppShell.Item
                  href={routes.admin.index.href()}
                  label="Back to Admin Console"
                  current={false}
                  icon={<ShieldCheckIcon size={16} />}
                />
              </AppShell.Group>
            )}
          </div>
        }
        footer={
          <div mix={[u.hstack({ gap: 2, align: "center", justify: "between" })]}>
            <div mix={[u.grow(1), u.minWidth(0)]}>
              <AppShell.Identity
                chevron={false}
                avatar={<Avatar size="sm">{initial}</Avatar>}
                name={user.name}
                detail={user.department || user.email}
              />
            </div>
            <form method="POST" action={routes.auth.logout.href()} mix={[u.shrink(0)]}>
              <Button
                type="submit"
                variant="ghost"
                color="neutral"
                size="sm"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOutIcon size={16} />
              </Button>
            </form>
          </div>
        }
        topbar={
          <div mix={[u.hstack({ gap: 3, align: "center", justify: "between" }), u.width("full")]}>
            <div mix={[u.hstack({ gap: 2, align: "center" }), u.minWidth(0)]}>
              <Text
                mix={[u.fontSize("sm"), u.weight("semibold"), u.fg("neutral.emphasis"), u.m(0)]}
              >
                PAART Faculty Academic Desk
              </Text>
              <Badge color={user.role === "admin" ? "brand" : "warning"} variant="outline">
                {user.role === "admin" ? "Admin (Faculty View)" : "Faculty"}
              </Badge>
            </div>
            <div mix={[u.hstack({ gap: 2, align: "center" })]}>
              <Link
                href={routes.home.href()}
                mix={[
                  u.hstack({ gap: 1.5, align: "center" }),
                  u.fontSize("xs"),
                  u.weight("medium"),
                  u.fg("neutral.muted"),
                  u.textDecoration("none")
                ]}
              >
                <span>Live Site</span>
                <ExternalLinkIcon size={13} />
              </Link>
              <ThemeToggle variant="ghost" />
            </div>
          </div>
        }
      >
        <div mix={[u.vstack({ gap: 6 }), u.p(6), u.maxWidth("72rem"), u.width("full")]}>
          {children}
        </div>
      </AppShell>
    )
  }
}
