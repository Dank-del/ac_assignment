import Link from "next/link";
import { MainNav } from "./main-nav";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { cookies } from "next/headers";

export function SiteHeader() {
    const c = cookies();
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <MainNav />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-1">
                        {!c.get('token') &&
                            <Link
                                href='/signup'
                            >
                                <Button>Sign Up</Button>
                            </Link>
                        }
                        {c.get('token') && <Link
                            href="/dashboard"
                        >
                            <Button>Dashboard</Button>
                        </Link>
                        }
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}