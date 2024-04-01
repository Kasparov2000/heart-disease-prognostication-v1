'use client'
import {Button} from "@/components/ui/button";
import {SignedIn, SignedOut, UserButton, useClerk, useUser, SignInButton} from "@clerk/nextjs";
import Link from "next/link";
import {useRouter} from 'next/navigation';
import React from "react";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {ArrowBigRight, ArrowRight} from "lucide-react";

export function Header() {
    const {signOut} = useClerk();
    const router = useRouter();
    const {user: userClerk} = useUser();
    const userDb = useQuery(api.users.getMe, {userId: userClerk?.id ?? undefined});
    const checkSubscription = useQuery(api.payments.checkSubscriptionStatus, {
        orgId: userDb?.orgId ?? undefined
    });

    const isPremiumUser = checkSubscription?.planType === 'premium';

    return (
        <div className="relative z-10 border-b py-4 bg-gray-50">
            <div className="container mx-auto justify-between flex items-center">
                <Link href="/" className="flex gap-2 items-center text-xl text-black">
                    <p className={'text-lg text-center font-bold bg-clip-text text-transparent bg-gradient-to-l from-blue-900 to-red-400'}>heart.<span>io</span>
                    </p>
                </Link>

                <div className="flex items-center">
                    <SignedIn>
                        {checkSubscription?.planType && !isPremiumUser && userDb?.orgId && (
                            <Button className={'mr-4'} onClick={() => router.push(`/payment/${userDb.orgId}?planType=premium`)}>
                                Upgrade to Premium
                                <ArrowRight className={'-rotate-45'}/>
                            </Button>
                        )}
                        <Button variant={"outline"} className={'mr-4'}>
                            <Link href="/dashboard/doctor/">Dashboard</Link>
                        </Button>
                    </SignedIn>
                    <UserButton/>
                    <SignedOut>
                        <SignInButton>
                            <Button className={'ml-4'}>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <button className={'ml-4'} onClick={() => signOut(() => router.push("/"))}>
                            Sign out
                        </button>
                    </SignedIn>
                </div>
            </div>
        </div>
    );
}
