import { action } from "./_generated/server";
import { v } from "convex/values";

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