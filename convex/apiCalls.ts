import { action } from "./_generated/server";
import { v } from "convex/values";

export const getPokemon = action({
    args: { pokeName: v.string() },
    handler: async (_, args: any) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${args.pokeName}`);
        const data = await response.json();
        return data;
    },
});