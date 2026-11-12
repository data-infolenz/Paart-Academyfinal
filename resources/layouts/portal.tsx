import type { Handle, RemixNode } from "remix/component"
import {
  ActivityIcon,
  AwardIcon,
  BellIcon,
  CalendarIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Avatar, Badge, Button, Link, Text } from "@sdxc/ui"
import { AppShell } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import { ThemeToggle } from "~/resources/components/theme-toggle"
import { routes } from "~/routes"

export interface PortalLayoutProps {
  user: SessionUser
  currentPath: string
  children?: RemixNode
}

const PORTAL_SHELL_LABELS: AppShell.Labels = {
  nav: "Aspirant Portal Navigation",
  skip: "Skip to content",
  menu: "Open navigation menu",
  close: "Close navigation",
  collapse: "Toggle sidebar"
}

const PORTAL_NAV_ITEMS = [
  { label: "Dashboard Overview", href: routes.portal.index.href(), icon: LayoutDashboardIcon },
  { label: "Syllabus & Progress", href: routes.portal.progress.href(), icon: ActivityIcon },
  { label: "Exam Timetable", href: routes.portal.exams.href(), icon: CalendarIcon },
  { label: "My Marks & Ranks", href: routes.portal.marks.href(), icon: AwardIcon },
  { label: "Study Materials", href: routes.portal.materials.href(), icon: FileTextIcon },
  { label: "Notifications", href: routes.portal.notifications.href(), icon: BellIcon }
]

export function PortalLayout(handle: Handle<PortalLayoutProps>) {
  return () => {
    const { user, currentPath, children } = handle.props
    const initial = (user.name[0] || user.email[0] || "S").toUpperCase()

    return (
      <AppShell
        id="paart-aspirant-shell"
        labels={PORTAL_SHELL_LABELS}
        peek
        workspace={
          <Link
            href={routes.portal.index.href()}
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
              detail="Aspirant Learning Portal"
            />
          </Link>
        }
        nav={
          <div mix={[u.vstack({ gap: 4 })]}>
            <AppShell.Group title="My Learning Workspace">
              {PORTAL_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isCurrent =
                  item.href === "/portal"
                    ? currentPath === "/portal"
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
          </div>
        }
        footer={
          <div mix={[u.hstack({ gap: 2, align: "center", justify: "between" })]}>
            <div mix={[u.grow(1), u.minWidth(0)]}>
              <AppShell.Identity
                chevron={false}
                avatar={<Avatar size="sm">{initial}</Avatar>}
                name={user.name}
                detail={user.email}
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
                PAART Aspirant Portal
              </Text>
              <Badge color="success" variant="outline">
                Enrolled Aspirant
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
                <span>Academy Website</span>
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
