import { Button } from "@/components/ui/button";
import {
    OrganizationSwitcher,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    useSession,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <div className="relative z-10 border-b bg-gray-800 h-20">
            <div className="items-center container mx-auto justify-between flex">
                <div className="flex gap-2">
                    <UserButton />
                    <SignedOut>
                        <SignInButton>
                            <Button>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </div>
    );
}
