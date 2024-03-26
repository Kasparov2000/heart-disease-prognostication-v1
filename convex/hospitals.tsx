import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

export const getHospitalById = query({
    args: { hospitalId: v.id('hospitals') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("hospitals")
            .filter((q) => q.eq(q.field("_id"), args.hospitalId))
            .order("desc")
            .take(100);
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
        accreditationDetails: v.optional(v.string()),
        authorizedContact: v.string(),
        authorizedEmail: v.string(),
        authorizedPhone: v.string(),
        positionTitle: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('hospitals', args);
    },
});
