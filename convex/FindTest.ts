import { v } from "convex/values";
import { query } from "./_generated/server";

export const getJTbyTestId = query({
    args: { testId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("generatedCards")
            .filter((q) => q.eq(q.field("testId"), args.testId))
            .first();
        return test?.jobTitle;
    },
});



export const getFJTbyTestId = query({
    args: { testId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("cards")
            .filter((q) => q.eq(q.field("testId"), args.testId))
            .first();
        return test?.jobTitle;
    },
});





