import { useMutation as useTanstackMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Mutation for voting for a Pokemon
export const useVoteForPokemonMutation = () => {
    const convexVoteForPokemonFn = useConvexMutation(api.mutations.voteForPokemon);
    return useTanstackMutation({
        mutationFn: convexVoteForPokemonFn,
    });
};

// Mutation for ending a poll
export const useEndPollMutation = () => {
    const convexEndPollFn = useConvexMutation(api.mutations.endPoll);
    return useTanstackMutation({
        mutationFn: convexEndPollFn,
    });
};

// Mutation (Action) for creating a poll
export const useCreatePollMutation = () => {
    const performCreatePollAction = useAction(api.actions.createPollAction);
    return useTanstackMutation({
        mutationFn: performCreatePollAction,
    });
}; 