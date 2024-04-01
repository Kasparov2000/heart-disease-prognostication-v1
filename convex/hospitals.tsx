import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

export const getHospital = query({
    args: {
        orgId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("hospitals")
            .filter((q) => q.eq(q.field("orgId"), args.orgId))
            .order("desc")
            .first();
    }
});
export const createHospital = mutation({
    args: {
        name: v.string(),
        country: v.string(),
        city: v.string(),
        state: v.string(),
        postalCode: v.string(),
        phone: v.string(),
        email: v.string(),
        website: v.optional(v.string()),
        type: v.string(),
        registrationNumber: v.string(),
        taxId: v.optional(v.string()),
        doctorName: v.string(),
        doctorEmail: v.string(),
        doctorPhone: v.string(),
        specialization: v.string(),
        licenseNumber: v.string(),
        status: v.string(),
        applicationId: v.id('applications'),
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('hospitals', args);
    },
});
