import { toast } from 'react-hot-toast';
import type { Id, CreatePollActionFn, VoteForPokemonMutationFn, EndPollMutationFn } from '../types';

// Define types for Convex mutation/action functions for clarity
// These should match the signatures of the functions returned by useAction/useMutation

export const handleCreatePollUtil = async (
    pokemonAName: string,
    pokemonBName: string,
    createPollAction: CreatePollActionFn,
    setIsCreatingPoll: (isCreating: boolean) => void,
    setPokemonANameState: (name: string) => void,
    setPokemonBNameState: (name: string) => void
) => {
    if (!pokemonAName.trim() || !pokemonBName.trim()) {
        toast.error("Please enter names for both Pokémon.");
        return;
    }
    if (pokemonAName.trim().toLowerCase() === pokemonBName.trim().toLowerCase()) {
        toast.error("Please enter two different Pokémon names.");
        return;
    }

    setIsCreatingPoll(true);
    try {
        await createPollAction({ pokemonAName: pokemonAName.trim(), pokemonBName: pokemonBName.trim() });
        toast.success('New poll created successfully!');
        setPokemonANameState("");
        setPokemonBNameState("");
    } catch (error) {
        console.error("Failed to create poll:", error);
        const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred.";
        const userFriendlyMessage = errorMessage.includes("Uncaught Error: ")
            ? errorMessage.split("Uncaught Error: ")[1].split(" at ")[0]
            : errorMessage;
        toast.error(`Error creating poll: ${userFriendlyMessage}`);
    } finally {
        setIsCreatingPoll(false);
    }
};

export const handleVoteUtil = async (
    activePollId: Id<"polls">,
    pokemonId: Id<"pokemon">,
    clientIP: string | null,
    voteForPokemonMutation: VoteForPokemonMutationFn
) => {
    if (!clientIP) {
        toast.error("Could not determine IP address. Please wait or refresh.");
        return;
    }
    if (!activePollId) {
        toast.error("Active poll ID is missing. Cannot cast vote.");
        return;
    }

    try {
        await voteForPokemonMutation({ pollId: activePollId, pokemonId, ipAddress: clientIP });
        toast.success('Vote cast!');
    } catch (error) {
        console.error(`Failed to cast vote: ${(error as Error).message}`);
        // Attempt to provide a cleaner error message
        const userFriendlyMessage = (error as Error).message.includes("Uncaught Error: ")
            ? (error as Error).message.split("Uncaught Error: ")[1].split(" at ")[0]
            : (error as Error).message;
        toast.error(`Error voting: ${userFriendlyMessage}`);
    }
};

export const handleEndPollUtil = async (
    activePollId: Id<"polls">,
    endPollMutation: EndPollMutationFn
) => {
    if (!activePollId) {
        toast.error("Active poll ID is missing. Cannot end poll.");
        return;
    }
    try {
        await endPollMutation({ pollId: activePollId });
        toast.success('Poll ended!');
    } catch (error) {
        console.error("Failed to end poll:", error);
        toast.error(`Error ending poll. More details at the console.`);
    }
}; 