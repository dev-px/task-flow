"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderKanban, CheckSquare, Activity, Settings, User, LogOut } from "lucide-react"

export default function Sidebar() {
    const pathname = usePathname()

    const topLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Activity", href: "/activity", icon: Activity },
    ]

    const bottomLinks = [
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Logout", href: "/logout", icon: LogOut },
    ]

    const linkStyle = (href) =>
        `flex items-center justify-center p-2 rounded-lg transition
     ${pathname === href
            ? "bg-gray-100 text-black"
            : "text-gray-500 hover:bg-gray-100 hover:text-black"
        }`

    return (
        <aside className="h-screen w-16 border-r flex flex-col items-center py-4">

            {/* Logo */}
            <div className="font-bold text-lg mb-8">TF</div>

            {/* Top Links */}
            <nav className="flex flex-col gap-3 flex-1">
                {topLinks.map((link) => {
                    const Icon = link.icon
                    return (
                        <Link key={link.href} href={link.href} className={linkStyle(link.href)}>
                            <Icon size={20} />
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Links */}
            <nav className="flex flex-col gap-3">
                {bottomLinks.map((link) => {
                    const Icon = link.icon
                    return (
                        <Link key={link.href} href={link.href} className={linkStyle(link.href)}>
                            <Icon size={20} />
                        </Link>
                    )
                })}
            </nav>

        </aside>
    )
}