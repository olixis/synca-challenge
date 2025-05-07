import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import toast, { Toaster } from 'react-hot-toast';
// import { useConvexAuth } from 'convex/react'; // To check auth state - MOCKED
// Assuming useUser from Clerk for user identity, adjust if using a different provider
// import { useUser } from "@clerk/clerk-react"; 

const PokemonPoll = () => {
    // const { isAuthenticated, isLoading: authLoading } = useConvexAuth(); // MOCKED
    const isAuthenticated = true; // MOCKED
    const authLoading = false; // MOCKED
    // const { user } = useUser(); // Uncomment and use if you need user details from Clerk

    const activePoll = useQuery(api.queries.getActivePoll);
    const voteForPokemon = useMutation(api.mutations.voteForPokemon);
    const endPollMutation = useMutation(api.mutations.endPoll);

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

    // Check if the current user can vote
    // Note: Convex identity.subject is used as userId in the mutation. 
    // If your users table links Clerk userId differently, canUserVoteInPoll might need adjustment or a different approach.
    // For simplicity, we'll rely on the mutation to throw an error if already voted.
    // Alternatively, you could pass `user?.id` if that's your stored `userId`.
    // const canVote = useQuery(api.queries.canUserVoteInPoll, 
    //     (activePoll && user?.id) ? { pollId: activePoll._id, userId: user.id as Id<"users"> } : 'skip' 
    // );
    // For now, we'll allow attempting a vote and let the mutation handle logic.

    const handleVote = async (pokemonId: Id<"pokemon">) => {
        if (!activePoll || !isAuthenticated) return;
        try {
            await voteForPokemon({ pollId: activePoll._id, pokemonId });
            toast.success('Vote cast!');
            // Note: votesA and votesB queries will automatically refetch due to Convex reactivity.
        } catch (error) {
            console.error("Failed to cast vote:", error);
            toast.error(`Error voting: ${error instanceof Error ? error.message : String(error)}`);
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
            toast.error(`Error ending poll: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const messageClasses = "p-4 sm:p-5 text-center text-lg text-gray-300 pt-12 md:pt-16";

    if (authLoading) {
        return <div className={messageClasses}>Loading authentication...</div>;
    }

    if (!activePoll) {
        return <div className={messageClasses}>No active poll at the moment. Check back later!</div>;
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