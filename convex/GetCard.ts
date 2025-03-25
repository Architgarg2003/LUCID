
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getCardById = query({
    args: { cardId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("generatedCards")
            .filter((q) => q.eq(q.field("_id"), args.cardId))
            .first();
        return test;
    },
});


export const getInterviewCardById = query({
    args: { cardId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("generatedInterviewCards")
            .filter((q) => q.eq(q.field("_id"), args.cardId))
            .first();
        return test;
    },
});