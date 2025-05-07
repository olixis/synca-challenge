import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const voteForPokemon = mutation({
    args: {
        pollId: v.id("polls"),
        pokemonId: v.id("pokemon"),
    },
    handler: async (ctx, args) => {
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity) {
        //     throw new Error("User not authenticated");
        // }
        // const userId = identity.subject; 
        const userId = "jh7db966k4njdqb0zmsxyxpdp97ff4bn"; // Mocked userId

        // Check if user has already voted in this poll
        const existingVotes = await ctx.db.query("votes")
            .withIndex("for_poll", (q) => q.eq("pollId", args.pollId))
            .filter((q) => q.eq(q.field("userId"), userId as any))
            .collect();

        if (existingVotes.length > 0) {
            throw new Error("User has already voted in this poll");
        }

        await ctx.db.insert("votes", {
            pollId: args.pollId,
            pokemonId: args.pokemonId,
            userId: userId as any,
        });
    },
});

export const endPoll = mutation({
    args: { pollId: v.id("polls") },
    handler: async (ctx, args) => {
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity) {
        //     throw new Error("User not authenticated");
        // }
        // For now, allowing mocked user to end the poll

        await ctx.db.patch(args.pollId, { finished: true });
    },
});

// We might also need a mutation to create a poll, but that's outside the current scope.
// For now, we assume polls are created through other means (e.g., a script or directly in the dashboard). 