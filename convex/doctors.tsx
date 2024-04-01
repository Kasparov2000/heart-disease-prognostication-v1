import {mutation, query} from "./_generated/server";
import {v} from "convex/values";


export const getDoctor = query({
    args: {
        doctorId: v.optional(v.string()),
        userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.userId) {

            return await ctx.db
                .query("doctors")
                .filter((q) => q.eq(q.field("userId"), args.userId))
                .first();
        }
        if (args.doctorId) {
            return await ctx.db
                .query("doctors")
                .filter((q) => q.eq(q.field("_id"), args.doctorId))
                .first();
        }
    },

});