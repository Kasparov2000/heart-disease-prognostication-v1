import {internalMutation, internalQuery, mutation, query} from "./_generated/server";
import {v} from "convex/values";


// Mutation to update the status of an application
export const _updateApplicationStatus = internalMutation({
    args: {
        applicationId: v.id("applications"),
        newStatus: v.string(),
        orgId: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {

        await ctx.db.patch(args.applicationId, { status: args.newStatus });
        const application = await ctx.db.get(args.applicationId);
        if (application?.status === 'approved' && application) {
            console.log('working')
            await ctx.db.insert('users', {
                userId: args.userId,
                orgId: args.orgId
            })

            await ctx.db.insert('doctors', {
                phone: application.doctorPhone,
                name: application.doctorName,
                email: application.doctorEmail,
                specialization: application.specialization,
                orgId: args.orgId,
                userId: args.userId
            });

            return await ctx.db.insert('hospitals', {
                // Hospital details
                name: application.name,
                country: application.country,
                city: application.city,
                state: application.state,
                postalCode: application.postalCode,
                phone: application.phone,
                email: application.email,
                website: application.website,
                type: application.type,
                registrationNumber: application.registrationNumber,
                taxId: application.taxId,

                doctorName: application.doctorName,
                doctorEmail: application.doctorEmail,
                doctorPhone: application.doctorPhone,
                specialization: application.specialization,
                licenseNumber: application.licenseNumber,

                applicationId: application._id,
                orgId: args.orgId
            })
        }
    },
});

// Query to fetch the details of a specific application
export const getApplicationDetails = query({
    args: { applicationId: v.id("applications") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.applicationId);

    },
});

export const getApplicationDetailsInternal = internalQuery({
    args: { applicationId: v.id("applications") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.applicationId);

    },
});


export const getApplications = query({
    args: {},
    handler: async (ctx, args) => {
        return await ctx.db.query("applications").collect()
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
        phone: v.string(), // Hospital phone
        email: v.string(), // Hospital email
        website: v.optional(v.string()),
        type: v.string(),
        registrationNumber: v.string(),
        taxId: v.optional(v.string()),
        doctorName: v.string(),
        doctorEmail: v.string(),
        doctorPhone: v.string(),
        specialization: v.string(),
        licenseNumber: v.string(),
    },
    handler: async (ctx, args) => {
        const newApplication = {
            ...args,
            status: 'pending'
        };
        return await ctx.db.insert('applications', newApplication);
    },
});
