// import { v } from "convex/values";
// import { query } from "./_generated/server";

// export const getTestData = query({
//     args: { testId: v.string() },
//     handler: async (ctx, args) => {
//         const testData = await ctx.db.get(args.testId);
//         return testData;
//     },
// });


import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTestById = query({
    args: { testId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("Test")
            .filter((q) => q.eq(q.field("_id"), args.testId))
            .first();
        return test;
    },
});



export const getFTestById = query({
    args: { testId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("featuredTest")
            .filter((q) => q.eq(q.field("_id"), args.testId))
            .first();
        return test;
    },
});