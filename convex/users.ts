import {query} from "./_generated/server";
import {v} from "convex/values";

export const getMe = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .first();
  }
})