import {mutation, query} from "./_generated/server";
import { v } from "convex/values";

// Mutation to update the status of an application
export const updateApplicationStatus = mutation({
    args: {
        applicationId: v.id("applications"),
        newStatus: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.applicationId, { status: args.newStatus });
    },
});

// Query to fetch the details of a specific application
export const getApplicationDetails = query({
    args: { applicationId: v.id("applications") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.applicationId);

    },
});

export const getApplications = query({
    args: {},
    handler: async (ctx, args) => {
        const applications = await ctx.db.query("applications").collect()
        console.log({applications})
        return applications
    },
})
// Mutation to create a new application
export const createNewApplication = mutation({
    args: {
        name: v.string(),
        country: v.string(),
        city: v.string(),
        state: v.string(),
        postalCode: v.string(),
        phone: v.string(),
        email: v.string(),
        website: v.string(),
        type: v.string(),
        registrationNumber: v.string(),
        taxId: v.string(),
        accreditationDetails: v.optional(v.string()),
        authorizedContact: v.string(),
        authorizedEmail: v.string(),
        authorizedPhone: v.string(),
        positionTitle: v.string(),
    },
    handler: async (ctx, args) => {
        const newApplication = {
            ...args,
            status: 'pending'
        };
        return await ctx.db.insert('applications', newApplication);
    },
});
