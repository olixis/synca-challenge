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
            throw new Error("This user has already voted in this poll");
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

export const getOrCreatePokemon = mutation({
    args: {
        name: v.string(),
        baseExp: v.float64(),
        height: v.float64(),
        spriteImgUrl: v.string(),
        weight: v.float64(),
    },
    handler: async (ctx, args) => {
        const existingPokemon = await ctx.db
            .query("pokemon")
            .filter((q) => q.eq(q.field("name"), args.name))
            .unique();

        if (existingPokemon) {
            // Potential improvement: Update existing pokemon data if it changed in PokeAPI?
            // For now, if it exists, we just return its ID.
            return existingPokemon._id;
        }

        const pokemonId = await ctx.db.insert("pokemon", {
            name: args.name,
            baseExp: args.baseExp,
            height: args.height,
            spriteImgUrl: args.spriteImgUrl,
            weight: args.weight,
        });
        return pokemonId;
    },
});

export const createPoll = mutation({
    args: {
        pokemonAId: v.id("pokemon"),
        pokemonBId: v.id("pokemon"),
    },
    handler: async (ctx, args) => {
        // Add any authorization logic here if needed, e.g., check if user is admin
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity || identity.subject !== "mocked_admin_user_id") { // Example admin check
        //     throw new Error("User not authorized to create polls.");
        // }

        if (args.pokemonAId === args.pokemonBId) {
            throw new Error("Cannot create a poll with the same Pokémon twice.");
        }

        const newPollId = await ctx.db.insert("polls", {
            pokemonAId: args.pokemonAId,
            pokemonBId: args.pokemonBId,
            finished: false,
        });
        return newPollId;
    },
}); 