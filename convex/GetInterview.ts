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

export const getInterviewById = query({
    args: { InterviewId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("Interview")
            .filter((q) => q.eq(q.field("_id"), args.InterviewId))
            .first();
        return test;
    },
});



export const getFInterviewById = query({
    args: { InterviewId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("featuredInterview")
            .filter((q) => q.eq(q.field("_id"), args.InterviewId))
            .first();
        return test;
    },
});