import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '../../convex/_generated/api';
import type { UsePokemonByIdQueryArgs, UseVotesForPokemonInPollQueryArgs } from '../types';

// Query for fetching a Pokemon by its ID
export const usePokemonByIdQuery = ({ pokemonId, enabled = true }: UsePokemonByIdQueryArgs) => {
    return useTanstackQuery({
        ...convexQuery(api.queries.getPokemonById, pokemonId ? { pokemonId } : 'skip'),
        enabled: !!pokemonId && enabled,
    });
};

// Query for fetching votes for a Pokemon in a specific poll
export const useVotesForPokemonInPollQuery = ({ pollId, pokemonId, enabled = true }: UseVotesForPokemonInPollQueryArgs) => {
    return useTanstackQuery({
        ...convexQuery(
            api.queries.getAllVotesForPokemonInPoll,
            pollId && pokemonId ? { pollId, pokemonId } : 'skip'
        ),
        enabled: !!pollId && !!pokemonId && enabled,
    });
};

// Query for the active poll (remains unchanged)
export const useActivePollQuery = () => {
    return useTanstackQuery(
        convexQuery(api.queries.getActivePoll, {})
    );
}; 