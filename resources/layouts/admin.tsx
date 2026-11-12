import type { Handle, RemixNode } from "remix/component"
import {
  BookOpenIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GraduationCapIcon,
  ImageIcon,
  InboxIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  NewspaperIcon,
  SettingsIcon,
  UsersIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Avatar, Badge, Button, Link, Text } from "@sdxc/ui"
import { AppShell } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import { ThemeToggle } from "~/resources/components/theme-toggle"
import { routes } from "~/routes"

export interface AdminLayoutProps {
  user: AdminUser
  currentPath: string
  children?: RemixNode
}

const ADMIN_SHELL_LABELS: AppShell.Labels = {
  nav: "Admin Navigation",
  skip: "Skip to content",
  menu: "Open navigation menu",
  close: "Close navigation",
  collapse: "Toggle sidebar"
}

const NAV_GROUPS = [
  {
    title: "Admissions & Access",
    items: [
      { label: "Overview", href: routes.admin.index.href(), icon: LayoutDashboardIcon },
      { label: "Users & Access", href: routes.admin.users.href(), icon: UsersIcon },
      { label: "Batches", href: routes.admin.batches.href(), icon: LayersIcon },
      { label: "Admissions", href: routes.admin.admissions.href(), icon: GraduationCapIcon },
      { label: "Enquiries", href: routes.admin.enquiries.href(), icon: InboxIcon }
    ]
  },
  {
    title: "Academic CMS",
    items: [
      { label: "Courses", href: routes.admin.courses.href(), icon: BookOpenIcon },
      { label: "Study Materials", href: routes.admin.materials.href(), icon: FileTextIcon },
      { label: "Blogs & Updates", href: routes.admin.blogs.href(), icon: NewspaperIcon },
      { label: "Gallery", href: routes.admin.gallery.href(), icon: ImageIcon },
      { label: "Site Settings", href: routes.admin.settings.href(), icon: SettingsIcon }
    ]
  },
  {
    title: "LMS Workspaces",
    items: [
      { label: "Faculty Workspace", href: routes.faculty.index.href(), icon: GraduationCapIcon }
    ]
  }
]

export function AdminLayout(handle: Handle<AdminLayoutProps>) {
  return () => {
    const { user, currentPath, children } = handle.props
    const initial = (user.name[0] || user.email[0] || "A").toUpperCase()

    return (
      <AppShell
        id="paart-admin-shell"
        labels={ADMIN_SHELL_LABELS}
        peek
        workspace={
          <Link
            href={routes.admin.index.href()}
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
              detail="Admin Console"
            />
          </Link>
        }
        nav={
          <div mix={[u.vstack({ gap: 4 })]}>
            {NAV_GROUPS.map((group) => (
              <AppShell.Group key={group.title} title={group.title}>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isCurrent =
                    item.href === "/admin"
                      ? currentPath === "/admin"
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
            ))}
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
                PAART Academy Administration
              </Text>
              <Badge color="brand" variant="outline">
                Admin
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
