import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import toast, { Toaster } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
// import { useConvexAuth } from 'convex/react'; // To check auth state - MOCKED

const PokemonPoll = () => {
    // const { isAuthenticated, isLoading: authLoading } = useConvexAuth(); // MOCKED
    const isAuthenticated = true; // MOCKED
    const [clientIP, setClientIP] = useState<string | null>(null); // Added state for IP

    const activePoll = useQuery(api.queries.getActivePoll);
    const voteForPokemon = useMutation(api.mutations.voteForPokemon);
    const endPollMutation = useMutation(api.mutations.endPoll);
    const createPoll = useAction(api.actions.createPollAction);

    // State for creating a new poll
    const [pokemonAName, setPokemonAName] = useState("");
    const [pokemonBName, setPokemonBName] = useState("");
    const [isCreatingPoll, setIsCreatingPoll] = useState(false);

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


    const handleVote = async (pokemonId: Id<"pokemon">) => {
        if (!activePoll || !isAuthenticated) return;

        if (!clientIP) {
            toast.error("Could not determine IP address. Please wait or refresh.");
            return;
        }

        try {
            await voteForPokemon({ pollId: activePoll._id, pokemonId, ipAddress: clientIP });
            toast.success('Vote cast!');
            // Note: votesA and votesB queries will automatically refetch due to Convex reactivity.
        } catch (error) {
            console.error(`Failed to cast vote: ${(error as Error).message}`);
            toast.error(`Error voting: ${(error as Error).message.split("Uncaught Error: ")[1].split(" at ")[0]}`);
        }
    };

    const handleEndPoll = async () => {
        if (!activePoll || !isAuthenticated) return;
        try {
            await endPollMutation({ pollId: activePoll._id });
            toast.success('Poll ended!');
            // UI should ideally react to activePoll becoming null or finished
        } catch (error) {
            console.error("Failed to end poll:", error);
            toast.error(`Error ending poll. More details at the console.`);
        }
    };

    const handleCreatePoll = async (event: React.FormEvent) => {
        event.preventDefault();
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
            await createPoll({ pokemonAName: pokemonAName.trim(), pokemonBName: pokemonBName.trim() });
            toast.success('New poll created successfully!');
            setPokemonAName("");
            setPokemonBName("");
            // activePoll query will update automatically and show the new poll
        } catch (error) {
            console.error("Failed to create poll:", error);
            const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred.";
            const userFriendlyMessage = errorMessage.includes("Uncaught Error: ")
                ? errorMessage.split("Uncaught Error: ")[1].split(" at ")[0]
                : errorMessage;
            toast.error(`Error creating poll: ${userFriendlyMessage}`);
        }
        setIsCreatingPoll(false);
    };

    const messageClasses = "p-4 sm:p-5 text-center text-lg text-gray-300 pt-12 md:pt-16";

    if (isCreatingPoll) {
        return <div className={messageClasses}>Creating your poll... Hang tight!</div>;
    }

    // If activePoll is undefined, the query is still loading.
    if (activePoll === undefined) {
        return <div className={messageClasses}>Loading poll status...</div>;
    }

    // If activePoll is null, no active poll exists. Show create poll form.
    if (activePoll === null) {
        // return <div className={messageClasses}>No active poll at the moment. Check back later!</div>;
        return (
            <div className="flex flex-col items-center font-sans p-4 sm:p-5 bg-transparent pt-12 md:pt-16">
                <Toaster position="top-center" reverseOrder={false} />
                <h1 className="mb-4 sm:mb-6 text-white font-bold text-2xl sm:text-3xl md:text-4xl text-center shrink-0">Start a New Pokémon Battle!</h1>
                <form onSubmit={handleCreatePoll} className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-xl">
                    <div className="mb-4">
                        <label htmlFor="pokemonAName" className="block text-gray-300 text-sm font-bold mb-2">Pokémon 1 Name:</label>
                        <input
                            type="text"
                            id="pokemonAName"
                            value={pokemonAName}
                            onChange={(e) => setPokemonAName(e.target.value)}
                            placeholder="e.g., Pikachu"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 placeholder-gray-500"
                            disabled={isCreatingPoll}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="pokemonBName" className="block text-gray-300 text-sm font-bold mb-2">Pokémon 2 Name:</label>
                        <input
                            type="text"
                            id="pokemonBName"
                            value={pokemonBName}
                            onChange={(e) => setPokemonBName(e.target.value)}
                            placeholder="e.g., Charizard"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 placeholder-gray-500"
                            disabled={isCreatingPoll}
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                            disabled={isCreatingPoll}
                        >
                            {isCreatingPoll ? 'Starting...' : 'Start Battle!'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (!pokemonA || !pokemonB) {
        return <div className={messageClasses}>Loading Pokémon details...</div>;
    }

    // A simple way to check if the user has voted for this specific poll instance
    // This doesn't use canUserVoteInPoll query directly here for simplicity,
    // relying on mutation error, but you could integrate canUserVoteInPoll for proactive UI changes.
    // const hasVoted = canVote === false; 

    return (
        <div className="flex flex-col items-center font-sans p-4 sm:p-5 bg-transparent pt-12 md:pt-16">
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="mb-4 sm:mb-6 text-white font-bold text-2xl sm:text-3xl md:text-4xl text-center shrink-0">Pokémon Popularity Poll!</h1>

            <div className="flex flex-col items-center w-full px-2 mb-4">
                <div className="flex flex-col md:flex-row justify-around items-center md:items-start w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl gap-3 md:gap-4">
                    {/* Pokemon A Card */}
                    <div className="text-center p-3 sm:p-4 border border-gray-700 rounded-xl w-full bg-white shadow-lg">
                        <img src={pokemonA.spriteImgUrl} alt={pokemonA.name} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-2" />
                        <h2 className="my-1 text-gray-800 font-bold text-lg sm:text-xl md:text-xl">{pokemonA.name.toUpperCase()}</h2>
                        <p className="text-xs sm:text-sm text-gray-700">Weight: {pokemonA.weight} | Height: {pokemonA.height}</p>
                        <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">Base Exp: {pokemonA.baseExp}</p>
                        <p className="text-base sm:text-lg font-bold text-gray-800 my-1 sm:my-2">Votes: {votesACount}</p>
                        {isAuthenticated ? (
                            <button
                                onClick={() => handleVote(pokemonA._id)}
                                className="py-1.5 px-3 text-xs sm:text-sm cursor-pointer bg-green-500 text-white border-none rounded-md transition-colors duration-200 ease-in-out hover:bg-green-600"
                            >
                                Vote for {pokemonA.name}
                            </button>
                        ) : <p className="text-gray-600 text-xs sm:text-sm">Please log in to vote.</p>}
                    </div>

                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400 self-center my-2 md:my-2 shrink-0">VS.</div>

                    {/* Pokemon B Card */}
                    <div className="text-center p-3 sm:p-4 border border-gray-700 rounded-xl w-full bg-white shadow-lg">
                        <img src={pokemonB.spriteImgUrl} alt={pokemonB.name} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-2" />
                        <h2 className="my-1 text-gray-800 font-bold text-lg sm:text-xl md:text-xl">{pokemonB.name.toUpperCase()}</h2>
                        <p className="text-xs sm:text-sm text-gray-700">Weight: {pokemonB.weight} | Height: {pokemonB.height}</p>
                        <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">Base Exp: {pokemonB.baseExp}</p>
                        <p className="text-base sm:text-lg font-bold text-gray-800 my-1 sm:my-2">Votes: {votesBCount}</p>
                        {isAuthenticated ? (
                            <button
                                onClick={() => handleVote(pokemonB._id)}
                                className="py-1.5 px-3 text-xs sm:text-sm cursor-pointer bg-blue-500 text-white border-none rounded-md transition-colors duration-200 ease-in-out hover:bg-blue-600"
                            >
                                Vote for {pokemonB.name}
                            </button>
                        ) : <p className="text-gray-600 text-xs sm:text-sm">Please log in to vote.</p>}
                    </div>
                </div>
            </div>

            {isAuthenticated && (
                <button
                    onClick={handleEndPoll}
                    className="py-2 px-4 sm:px-5 text-sm sm:text-base cursor-pointer bg-red-500 text-white border-none rounded-md transition-colors duration-200 ease-in-out hover:bg-red-600 mt-8 mb-2 sm:mb-4 shrink-0"
                >
                    End Battle!
                </button>
            )}
        </div>
    );
};

export default PokemonPoll; 