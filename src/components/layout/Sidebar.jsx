"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname()

    const links = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Projects", href: "/projects" },
        { name: "My Tasks", href: "/tasks" },
        { name: "Activity", href: "/activity" },
        { name: "Settings", href: "/settings" },
    ]

    const bottomLinks = [
        { name: "Profile", href: "/profile" },
        { name: "Logout", href: "/logout" },
    ]

    const linkStyle = (href) =>
        `transition ${pathname === href
            ? "text-black font-semibold"
            : "hover:text-gray-500"
        }`
    return (
        <aside className="h-screen w-56 border-r p-4">
            <h1 className="font-bold text-xl mb-6">TaskFlow</h1>

            <nav className="flex flex-col justify-between gap-4 h-full py-2">
                <div className="flex flex-col justify-start gap-6">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className={linkStyle(link.href)}>
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col justify-start gap-6">
                    {bottomLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={linkStyle(link.href)}>
                            {link.name}
                        </Link>
                    ))}
                </div>
            </nav>
        </aside>
    )
}