import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        ipAddress: v.string(),
    })
        .index("by_ipAddress", ["ipAddress"]),
    pokemon: defineTable({
        baseExp: v.float64(),
        height: v.float64(),
        name: v.string(),
        spriteImgUrl: v.string(),
        weight: v.float64(),
    }),
    polls: defineTable({
        finished: v.boolean(),
        pokemonAId: v.id("pokemon"),
        pokemonBId: v.id("pokemon"),
    }).index("is_active", ["finished"]),
    votes: defineTable({
        pokemonId: v.id("pokemon"),
        pollId: v.id("polls"),
        userId: v.id("users"),
    }).index("for_poll", ["pollId"])
        .index("for_pokemon", ["pokemonId"])
        .index("from_user", ["userId"]),
});