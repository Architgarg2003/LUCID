// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//     cards: defineTable({
//         userId: v.string(),
//         jobTitle: v.string(),
//         companyName: v.string(),
//         jobDescription: v.string(),
//         resume: v.string(),
//         difficultyLevel: v.string(),
//         tags: v.array(v.string()),
//         createdAt: v.string(),
//         updatedAt: v.string(),
//         embedding: v.array(v.float64()),
//     }).vectorIndex("by_embedding", {
//         vectorField: "embedding",
//         dimensions: 1536,
//         filterFields: ["jobTitle","difficultyLevel", "companyName", "jobTitle", "tags"],
//     }),


//     Test: defineTable({
//         userId: v.string(),
//         date: v.string(), // Assuming you want to store multiple dates
//         QuestionSet: v.array(
//             v.object({
//                 answer: v.string(),
//                 options: v.array(v.string()),
//                 question: v.string(),
//             })
//         ),
//     }),
// });



   


// FEATURED CARDS

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    cards: defineTable({
        tags: v.array(v.string()),           // Array of strings for tags
        difficultyLevel: v.string(),         // String for difficulty level
        companyName: v.string(),             // String for company name
        jobTitle: v.string(),                // String for job title
        createdAt: v.string(),               // String for creation timestamp
        updatedAt: v.string(),               // String for update timestamp
        testId: v.string(),                  // String for test ID
    }),

    // test
    Test: defineTable({
            userId: v.string(),
            date: v.string(), // Assuming you want to store multiple dates
            QuestionSet: v.array(
                v.object({
                    answer: v.string(),
                    options: v.array(v.string()),
                    question: v.string(),
                })
            ),
        }),


        // featured test
    // featuredTest: defineTable({
    //     date: v.string(), // Assuming you want to store multiple dates
    //     QuestionSet: v.array(
    //         v.object({
    //             answer: v.string(),
    //             options: v.array(v.string()),
    //             question: v.string(),
    //         })
    //     ),
    // }),

    featuredTest: defineTable({
        QuestionSet: v.array(
            v.object({
                answer: v.float64(),
                options: v.array(v.string()),
                question: v.string(),
            })
        ),
        date: v.string(),
    }),



    // GENERATED CARDS


    generatedCards: defineTable({
        tags: v.array(v.string()),             // Array of strings for tags
        companyName: v.string(),               // String for company name
        jobTitle: v.string(),                  // String for job title
        jobDescription: v.string(),            // String for job description
        starsCount: v.int64(),                 // Integer for stars count
        userId: v.string(),                    // String for user ID
        testId: v.string(),                    // String for test ID
        upvoteCount: v.int64(),                // Integer for upvote count
        // upvoteStatus:v.boolean(),
        resume: v.string(),                    // String for resume
        difficultyLevel: v.string(),           // String for difficulty level
        createdAt: v.string(),           // String for difficulty level
        embeddings: v.array(v.float64())    // Embeddings for companyName, jobTitle, and tags
    }).vectorIndex("by_embedding", {
        vectorField: "embeddings",
        dimensions: 768,                      // Adjust dimensions based on your embedding size
        filterFields: ["jobTitle"],
    }),


    TestAnswer: defineTable({
        userId: v.string(),
        testId: v.string(),
        date: v.string(), // Store date as a string in ISO format (e.g., "2023-09-05T12:34:56Z")
        jobTitle:v.string(),
        answerSet: v.array(v.object({
            question: v.string(),
            userAnswer: v.string(),
            correctAnswer: v.string(),
            providedOptions: v.array(v.string()) // Array of strings for the provided options
        }))
    }),

    files: defineTable({
        storageId: v.id("_storage"),
        userId: v.string(),
        fileName: v.string(),
        fileType: v.string(),
    }),

    // heatmap: defineTable({
    //     userId:v.string(),
    //     date: v.string(),
    //     noOfInteractions: v.int64(),
    // }),
    upVote:defineTable({
        userId:v.string(),
        cardId:v.string()
    }),

    upVoteCount:defineTable({
        cardId:v.string(),
        count:v.float64()
    }),

    wishList:defineTable({
        userId:v.string(),
        cardId:v.string()
    }),

    TotalInteraction:defineTable({
        userId:v.string(),
        InteractionNumber:v.float64(),
    }),

    DailyInteraction: defineTable({
        userId: v.string(),
        date: v.string(),
        count: v.float64(),
        level: v.float64()
    }),

    leaderboard:defineTable({
        userId:v.string(),
        username: v.string(),
        totalPoints: v.float64(),
        totalAccuracy: v.float64()
    }).index("byTotalPoints", ["totalPoints"]),

    messages: defineTable({
        sender: v.string(),
        text: v.string(),
        timestamp: v.number(),
    }),

    // leaderboard: defineTable({
    //     userId: v.string(),
    //     name: v.string(),
    //     totalPoints: v.int64(),
    // }),

    // history: defineTable({
    //     userId: v.string(),
    //     interactionHistory: v.array(v.string()),
    //     testId: v.string(),
    //     score: v.int64(),
    // }),



    // Interview

    generatedInterviewCards: defineTable({
        tags: v.array(v.string()),             // Array of strings for tags
        companyName: v.string(),               // String for company name
        jobTitle: v.string(),                  // String for job title
        jobDescription: v.string(),            // String for job description
        starsCount: v.int64(),                 // Integer for stars count
        userId: v.string(),                    // String for user ID
        InterviewId: v.string(),                    // String for test ID
        upvoteCount: v.int64(),                // Integer for upvote count
        // upvoteStatus:v.boolean(),
        resume: v.string(),                    // String for resume
        difficultyLevel: v.string(),           // String for difficulty level
        createdAt: v.string(),           // String for difficulty level
        embeddings: v.array(v.float64())    // Embeddings for companyName, jobTitle, and tags
    }).vectorIndex("by_embedding", {
        vectorField: "embeddings",
        dimensions: 768,                      // Adjust dimensions based on your embedding size
        filterFields: ["jobTitle"],
    }),


    Interview: defineTable({
        userId: v.string(),
        date: v.string(), // Assuming you want to store multiple dates
        QuestionSet: v.array(
            v.object({
                question: v.string(),
            })
        ),
    }),

    InterviewAnswer: defineTable({
        userId: v.string(),
        InterviewId: v.string(),
        date: v.string(), // Store date as a string in ISO format (e.g., "2023-09-05T12:34:56Z")
        jobTitle: v.string(),
        analytics:v.array(v.object({
            strength:v.optional(v.array(v.string())),
            weakness:v.optional(v.array(v.string())),
            summary:v.optional(v.string()),
            score:v.optional(v.string())
        })),
        answerSet: v.array(v.object({
            question: v.string(),
            userAnswer: v.string(),
        }))
    }),

    InterviewWishlist: defineTable({
        userId: v.string(),
        cardId: v.string()
    }),


    InterviewCards: defineTable({
        tags: v.array(v.string()),           // Array of strings for tags
        difficultyLevel: v.string(),         // String for difficulty level
        companyName: v.string(),             // String for company name
        jobTitle: v.string(),                // String for job title
        createdAt: v.string(),               // String for creation timestamp
        updatedAt: v.string(),               // String for update timestamp
        InterviewId: v.string(),                  // String for test ID
    }),

    featuredInterview: defineTable({
        QuestionSet: v.array(
            v.object({
                question: v.string(),
            })
        ),
        date: v.string(),
    }),


});




// GENERATED CARDS

// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
   
// });