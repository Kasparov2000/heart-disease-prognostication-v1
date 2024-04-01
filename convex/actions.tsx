"use node";

import {v} from "convex/values";
import Clerk from '@clerk/clerk-sdk-node/esm/instance';
import {action} from "./_generated/server";
import {internal} from "./_generated/api";
import {RegisteredAction} from "convex/server";

export const updateApplicationStatus : RegisteredAction<any, any, any> = action({
    args: {
        applicationId: v.id("applications"),
        newStatus: v.string()
    },
    handler: async (ctx, args) => {
        const applicationDetails = await ctx.runQuery(internal.applications.getApplicationDetailsInternal, {
            applicationId: args.applicationId
        })
        if (!applicationDetails) {
            throw new Error(`Applicant ${args.applicationId} not found.`)
        }
        const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || ``;

        const clerkClient = Clerk({ secretKey: CLERK_SECRET_KEY })

        const user = await clerkClient.users.createUser({emailAddress: [applicationDetails.doctorEmail]})

        const organization = await clerkClient.organizations.createOrganization({name: applicationDetails.name, createdBy: user.id});

        try {
            await clerkClient.allowlistIdentifiers.createAllowlistIdentifier({
                identifier: applicationDetails.doctorEmail,
                notify: false

            });
        } catch (e) {

        }

        await clerkClient.invitations.createInvitation({
            emailAddress: applicationDetails.doctorEmail,
            redirectUrl: 'http://localhost:3000/',
            ignoreExisting: true
        });

        return await ctx.runMutation(internal.applications._updateApplicationStatus, {
            orgId: organization.id, userId: user.id, ...args
        });

    }
})