import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CreatePollForm from './CreatePollForm';
import ActivePollDisplay from './ActivePollDisplay';
import type { PokemonData } from '../types'; // Added import for shared types
// import { useConvexAuth } from 'convex/react'; // To check auth state - MOCKED

const PokemonPoll = () => {
    // const { isAuthenticated, isLoading: authLoading } = useConvexAuth(); // MOCKED
    const isAuthenticated = true; // MOCKED
    const [clientIP, setClientIP] = useState<string | null>(null); // Stays here

    const activePoll = useQuery(api.queries.getActivePoll);
    const voteForPokemon = useMutation(api.mutations.voteForPokemon);
    const endPollMutation = useMutation(api.mutations.endPoll);
    const createPoll = useAction(api.actions.createPollAction);

    // Effect to fetch client IP
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
    }, []); // Empty dependency array means this runs once on mount

    // Fetch Pokémon details
    const pokemonA = useQuery(api.queries.getPokemonById, activePoll ? { pokemonId: activePoll.pokemonAId } : 'skip');
    const pokemonB = useQuery(api.queries.getPokemonById, activePoll ? { pokemonId: activePoll.pokemonBId } : 'skip');

    const votesA = useQuery(
        api.queries.getAllVotesForPokemonInPoll,
        activePoll && pokemonA ? { pollId: activePoll._id, pokemonId: pokemonA._id } : 'skip'
    );
    const votesB = useQuery(
        api.queries.getAllVotesForPokemonInPoll,
        activePoll && pokemonB ? { pollId: activePoll._id, pokemonId: pokemonB._id } : 'skip'
    );

    const votesACount = votesA?.length ?? "loading...";
    const votesBCount = votesB?.length ?? "loading...";

    const messageClasses = "p-4 sm:p-5 text-center text-lg text-gray-300 pt-12 md:pt-16";

    if (activePoll === undefined) {
        return <div className={messageClasses}>Loading poll status...</div>;
    }

    if (activePoll === null) {
        return (
            <AnimatePresence mode="wait">
                <CreatePollForm
                    createPollAction={createPoll}
                />
            </AnimatePresence>
        );
    }

    // At this point, activePoll is an object (not undefined, not null)
    // pokemonA and pokemonB queries depend on activePoll, so they are either loading or loaded.

    if (!pokemonA || !pokemonB) {
        return <div className={messageClasses}>Loading Pokémon details...</div>;
    }

    // At this point, activePoll, pokemonA, and pokemonB are all loaded.
    const typedPokemonA = pokemonA as PokemonData; // Assert as PokemonData, not | undefined | null
    const typedPokemonB = pokemonB as PokemonData; // Assert as PokemonData, not | undefined | null

    const isNumeric = (val: any): val is number => typeof val === 'number';
    const showWinningA = isNumeric(votesACount) && isNumeric(votesBCount) && votesACount > votesBCount;
    const showWinningB = isNumeric(votesACount) && isNumeric(votesBCount) && votesBCount > votesACount;

    return (
        <AnimatePresence mode="wait">
            {/* Since all loading states and null activePoll are handled by early returns,
                we can directly render ActivePollDisplay here. 
                activePoll is guaranteed to be an object, and pokemonA/B are loaded. */}
            <ActivePollDisplay
                pokemonA={typedPokemonA}
                pokemonB={typedPokemonB}
                votesACount={votesACount}
                votesBCount={votesBCount}
                isAuthenticated={isAuthenticated}
                showWinningA={showWinningA}
                showWinningB={showWinningB}
                activePollId={activePoll._id} // Safe: activePoll is an object here
                clientIP={clientIP}
                voteForPokemonMutation={voteForPokemon}
                endPollMutation={endPollMutation}
            />
        </AnimatePresence>
    );
};

export default PokemonPoll; 