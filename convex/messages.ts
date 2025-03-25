// convex/messages.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define the schema for a message
// const messageSchema = {
// //   roomId: v.string(),
//   sender: v.string(),
//   text: v.string(),
//   timestamp: v.number(),
// };

// Query to fetch all messages in a specific room
export const getMessages = query({
  args: { sender: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("messages").collect();

    //   .filter((q) => q.eq(q.field("roomId"), args.roomId))  
    },
});

// Mutation to send a new message
export const sendMessage = mutation({
  args: {
    sender: v.string(),
    text: v.string(),
    timestamp: v.number(),
  }
    ,
  handler: async (ctx, args) => {
    const message = await ctx.db.insert("messages",{
        sender: args.sender,
        text: args.text,
        timestamp: args.timestamp,
    });

    return message;

  },
});