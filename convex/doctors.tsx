import {mutation, query} from "./_generated/server";
import {v} from "convex/values";


export const getDoctorDetails = query({
    args: { doctorId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("doctors")
            .filter((q) => q.eq(q.field("_id"), args.doctorId))
            .first();
    },
});
export const CreateDoctor = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        specialization: v.string(),
        hospitalId: v.id('hospitals'),
        profilePicture: v.string(),
        // ... other doctor specific fields
    },
    handler: async (ctx, args) => {
        // Encrypt the password before storing it
        // Inserting doctor data into the 'doctors' table
        return await ctx.db.insert('doctors', {
            phone: args.phone,
            name: args.name,
            email: args.email,
            specialization: args.specialization,
            hospitalId: args.hospitalId,
        });
    }
});

