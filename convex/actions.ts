import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const getPokemon = action({
    args: { pokeName: v.string() },
    handler: async (_, args: any) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${args.pokeName}`);
        const data = await response.json();
        return data;
    },
});

export const getUserIP = action({
    args: {},
    handler: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    },
});

export const createPollAction = action({
    args: { pokemonAName: v.string(), pokemonBName: v.string() },
    handler: async (ctx, args): Promise<{ pollId: Id<"polls"> }> => {
        if (!args.pokemonAName || !args.pokemonBName) {
            throw new Error("Both Pokémon names must be provided.");
        }

        if (args.pokemonAName.toLowerCase() === args.pokemonBName.toLowerCase()) {
            throw new Error("Please provide two different Pokémon names.");
        }

        // Check for existing unfinished polls
        const unfinishedPolls = await ctx.runQuery(api.queries.getUnfinishedPolls);
        if (unfinishedPolls && unfinishedPolls.length > 0) {
            throw new Error("A poll was likely created while you were making yours. Please check the existing polls.");
        }

        // Fetch Pokémon A
        const responseA = await fetch(`https://pokeapi.co/api/v2/pokemon/${args.pokemonAName.toLowerCase()}`);
        if (!responseA.ok) {
            throw new Error(`Could not fetch Pokémon: ${args.pokemonAName}`);
        }
        const dataA = await responseA.json();

        // Fetch Pokémon B
        const responseB = await fetch(`https://pokeapi.co/api/v2/pokemon/${args.pokemonBName.toLowerCase()}`);
        if (!responseB.ok) {
            throw new Error(`Could not fetch Pokémon: ${args.pokemonBName}`);
        }
        const dataB = await responseB.json();

        // Parse and get/create Pokémon A
        const pokemonAId: Id<"pokemon"> = await ctx.runMutation(api.mutations.getOrCreatePokemon, {
            name: dataA.name,
            baseExp: dataA.base_experience,
            height: dataA.height,
            spriteImgUrl: dataA.sprites.front_default,
            weight: dataA.weight,
        });

        // Parse and get/create Pokémon B
        const pokemonBId: Id<"pokemon"> = await ctx.runMutation(api.mutations.getOrCreatePokemon, {
            name: dataB.name,
            baseExp: dataB.base_experience,
            height: dataB.height,
            spriteImgUrl: dataB.sprites.front_default,
            weight: dataB.weight,
        });

        // Create the poll
        const pollId: Id<"polls"> = await ctx.runMutation(api.mutations.createPoll, {
            pokemonAId: pokemonAId,
            pokemonBId: pokemonBId,
        });

        return { pollId };
    },
});