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

export interface PokemonCardProps {
    pokemon: PokemonData;
    votesCount: number | string;
    onVote: () => void;
    isAuthenticated: boolean;
    isWinning: boolean;
    buttonColorClass?: string;
}

export interface CreatePollFormProps {
    createPollAction: CreatePollActionFn;
}

export interface ActivePollDisplayProps {
    pokemonA: PokemonData;
    pokemonB: PokemonData;
    votesACount: number | string;
    votesBCount: number | string;
    isAuthenticated: boolean;
    showWinningA: boolean;
    showWinningB: boolean;
    activePollId: Id<"polls">;
    clientIP: string | null;
    voteForPokemonMutation: VoteForPokemonMutationFn;
    endPollMutation: EndPollMutationFn;
}

// Argument types for custom query hooks
export interface UsePokemonByIdQueryArgs {
    pokemonId: Id<"pokemon"> | undefined;
    enabled?: boolean;
}

export interface UseVotesForPokemonInPollQueryArgs {
    pollId: Id<"polls"> | undefined;
    pokemonId: Id<"pokemon"> | undefined;
    enabled?: boolean;
} 