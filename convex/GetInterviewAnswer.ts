
import { query } from "./_generated/server";
import { v } from "convex/values";

export const get_userAnswer = query({
    args: { answerId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("InterviewAnswer")
            .filter((q) => q.eq(q.field("_id"), args.answerId))
            .first();
        return test;
    },
});