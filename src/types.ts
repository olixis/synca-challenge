import type { Id as ConvexId, TableNames } from '../convex/_generated/dataModel';

// Re-exporting ConvexId as Id for convenience in other files
export type Id<TableName extends TableNames> = ConvexId<TableName>;

export interface PokemonData {
    _id: Id<"pokemon">;
    name: string;
    spriteImgUrl: string;
    weight: number;
    height: number;
    baseExp: number;
    // Add other properties if they exist in your actual data model
}

// Types for Convex mutation/action function signatures
// These describe the shape of functions returned by useAction/useMutation
// and are used for passing these functions as props or to utilities.

export type CreatePollActionFn = (params: { pokemonAName: string, pokemonBName: string }) => Promise<any>;

export type VoteForPokemonMutationFn = (params: {
    pollId: Id<"polls">; // Assuming 'polls' is the table name for polls in your schema
    pokemonId: Id<"pokemon">;
    ipAddress: string;
}) => Promise<any>;

export type EndPollMutationFn = (params: {
    pollId: Id<"polls">; // Assuming 'polls' is the table name for polls in your schema
}) => Promise<any>; 