import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const voteForPokemon = mutation({
    args: {
        pollId: v.id("polls"),
        pokemonId: v.id("pokemon"),
        ipAddress: v.string(),
    },
    handler: async (ctx, args) => {
        // Find or create user by IP address
        let user = await ctx.db
            .query("users")
            .withIndex("by_ipAddress", (q) => q.eq("ipAddress", args.ipAddress))
            .unique();

        let userIdToUse;

        if (!user) {
            // User does not exist, create them
            const newUserId = await ctx.db.insert("users", { ipAddress: args.ipAddress });
            userIdToUse = newUserId;
        } else {
            userIdToUse = user._id;
        }

        // Check if this user (identified by IP) has already voted in this poll
        const existingVotes = await ctx.db
            .query("votes")
            .withIndex("for_poll", (q) => q.eq("pollId", args.pollId))
            .filter((q) => q.eq(q.field("userId"), userIdToUse))
            .collect();

        if (existingVotes.length > 0) {
            throw new Error("This IP address has already voted in this poll");
        }

        await ctx.db.insert("votes", {
            pollId: args.pollId,
            pokemonId: args.pokemonId,
            userId: userIdToUse,
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