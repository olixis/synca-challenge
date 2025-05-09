import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CreatePollForm from './CreatePollForm';
import ActivePollDisplay from './ActivePollDisplay';
import type { PokemonData } from '../types';
import {
    useVoteForPokemonMutation,
    useEndPollMutation,
    useCreatePollMutation
} from '../hooks/usePokemonMutations';
import {
    useActivePollQuery,
    usePokemonByIdQuery,
    useVotesForPokemonInPollQuery
} from '../hooks/usePokemonQueries';
// import { useConvexAuth } from 'convex/react'; // To check auth state - MOCKED

const PokemonPoll = () => {
    // const { isAuthenticated, isLoading: authLoading } = useConvexAuth(); // MOCKED
    const isAuthenticated = true; // MOCKED
    const [clientIP, setClientIP] = useState<string | null>(null);

    // Effect to fetch client IP (runs once on mount)
    useEffect(() => {
        const fetchIP = async () => {
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const data = await response.json();
                setClientIP(data.ip);
            } catch (error) {
                console.error("Error fetching IP:", error);
                toast.error("Could not identify user, please refresh the page and try again.");
            }
        };
        fetchIP();
    }, []);

    // Individual Mutation Hooks
    const { mutateAsync: voteForPokemonAsync } = useVoteForPokemonMutation();
    const { mutateAsync: endPollMutationAsync } = useEndPollMutation();
    const { mutateAsync: createPollAsync } = useCreatePollMutation();

    // Active Poll Query
    const { data: activePollData, isPending: activePollIsPending } = useActivePollQuery();

    // Pokemon A Query (dependent on activePollData)
    const { data: pokemonAData, isPending: pokemonAIsPending } = usePokemonByIdQuery({
        pokemonId: activePollData?.pokemonAId,
        enabled: !!activePollData,
    });

    // Pokemon B Query (dependent on activePollData)
    const { data: pokemonBData, isPending: pokemonBIsPending } = usePokemonByIdQuery({
        pokemonId: activePollData?.pokemonBId,
        enabled: !!activePollData,
    });

    // Votes A Query (dependent on activePollData and pokemonAData)
    const { data: votesAData, isPending: votesAIsPending } = useVotesForPokemonInPollQuery({
        pollId: activePollData?._id,
        pokemonId: pokemonAData?._id,
        enabled: !!(activePollData && pokemonAData),
    });

    // Votes B Query (dependent on activePollData and pokemonBData)
    const { data: votesBData, isPending: votesBIsPending } = useVotesForPokemonInPollQuery({
        pollId: activePollData?._id,
        pokemonId: pokemonBData?._id,
        enabled: !!(activePollData && pokemonBData),
    });

    const messageClasses = "p-4 sm:p-5 text-center text-lg text-gray-300 pt-12 md:pt-16";

    if (activePollIsPending) {
        return <div className={messageClasses}>Loading poll status...</div>;
    }

    if (activePollData === null) {
        return (
            <AnimatePresence mode="wait">
                <CreatePollForm
                    createPollAction={createPollAsync}
                />
            </AnimatePresence>
        );
    }

    const activePoll = activePollData;

    if (pokemonAIsPending || pokemonBIsPending) {
        return <div className={messageClasses}>Loading Pokémon details...</div>;
    }

    if (!pokemonAData || !pokemonBData) {
        return <div className={messageClasses}>Pokémon details not found. You might need to create a new poll.</div>;
    }

    const pokemonA = pokemonAData;
    const pokemonB = pokemonBData;

    if (votesAIsPending || votesBIsPending) {
        return <div className={messageClasses}>Loading vote counts...</div>;
    }

    const votesACount = votesAData?.length ?? 0;
    const votesBCount = votesBData?.length ?? 0;

    const typedPokemonA = pokemonA as PokemonData;
    const typedPokemonB = pokemonB as PokemonData;

    const isNumeric = (val: any): val is number => typeof val === 'number';
    const showWinningA = isNumeric(votesACount) && isNumeric(votesBCount) && votesACount > votesBCount;
    const showWinningB = isNumeric(votesACount) && isNumeric(votesBCount) && votesBCount > votesACount;

    if (!activePoll) {
        return <div className={messageClasses}>Poll data has become unavailable. Please refresh.</div>;
    }

    return (
        <AnimatePresence mode="wait">
            <ActivePollDisplay
                pokemonA={typedPokemonA}
                pokemonB={typedPokemonB}
                votesACount={votesACount}
                votesBCount={votesBCount}
                isAuthenticated={isAuthenticated}
                showWinningA={showWinningA}
                showWinningB={showWinningB}
                activePollId={activePoll._id}
                clientIP={clientIP}
                voteForPokemonMutation={voteForPokemonAsync}
                endPollMutation={endPollMutationAsync}
            />
        </AnimatePresence>
    );
};

export default PokemonPoll; 