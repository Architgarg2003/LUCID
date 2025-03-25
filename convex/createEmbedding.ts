const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI('AIzaSyBK1edzaiNbCD3ngi7OL2yX-z3XqBjKuG4');


export async function getEmbeddings(text: string) {

    try {
        const model = genAI.getGenerativeModel({
            model: "text-embedding-004" // Removed options
        });
        const result = await model.embedContent(text);

        const data = result.embedding;
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}



import { v } from "convex/values";
import { action } from "./_generated/server";

export const createEmbeddings = action({
    args: {
        text: v.string()
    },
    handler: async (ctx, args) => {
        const embedding = await getEmbeddings(args.text);
        return embedding;
    },
});