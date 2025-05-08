import { query } from "./_generated/server";
import { v } from "convex/values";


export const getActivePoll = query({
    handler: async (ctx) => {
        return await ctx.db.query("polls")
            .withIndex("is_active", (q) => q.eq("finished", false))
            .unique()
    },
})

export const getAllVotesForPokemonInPoll = query({
    args: {
        pollId: v.id("polls"),
        pokemonId: v.id("pokemon"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("votes").withIndex("for_poll", (q) => q.eq("pollId", args.pollId)).filter((q) => q.eq(q.field("pokemonId"), args.pokemonId)).collect();
    },
})

export const canUserVoteInPoll = query({
    args: {
        pollId: v.id("polls"),
        ipAddress: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_ipAddress", (q) => q.eq("ipAddress", args.ipAddress))
            .unique();

        if (!user) {
            return true;
        }

        const votes = await ctx.db
            .query("votes")
            .withIndex("for_poll", (q) => q.eq("pollId", args.pollId))
            .filter((q) => q.eq(q.field("userId"), user._id))
            .collect();

        return votes.length === 0;
    },
})

export const getPokemonById = query({
    args: { pokemonId: v.id("pokemon") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.pokemonId);
    },
});

export const getUnfinishedPolls = query({
    handler: async (ctx) => {
        const unfinishedPolls = await ctx.db
            .query("polls")
            .filter((q) => q.eq(q.field("finished"), false))
            .collect();
        return unfinishedPolls;
    },
});

