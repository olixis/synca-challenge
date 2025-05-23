import React from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import PokemonCard from './PokemonCard';
import type { ActivePollDisplayProps } from '../types';
import { handleVoteUtil, handleEndPollUtil } from '../utils/pollUtils';

const ActivePollDisplay: React.FC<ActivePollDisplayProps> = ({
    pokemonA,
    pokemonB,
    votesACount,
    votesBCount,
    isAuthenticated,
    showWinningA,
    showWinningB,
    activePollId,
    clientIP,
    voteForPokemonMutation,
    endPollMutation
}) => {
    // Wrapper for PokemonCard's onVote to call the utility function
    const onVotePokemonA = () => {
        handleVoteUtil(activePollId, pokemonA._id, clientIP, voteForPokemonMutation);
    };

    const onVotePokemonB = () => {
        handleVoteUtil(activePollId, pokemonB._id, clientIP, voteForPokemonMutation);
    };

    // Handler for ending the poll using the utility function
    const onEndPoll = () => {
        handleEndPollUtil(activePollId, endPollMutation);
    };

    return (
        <motion.div
            key="active-poll-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center font-sans p-4 sm:p-5 bg-transparent pt-12 md:pt-16"
        >
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="mb-4 sm:mb-6 text-white font-bold text-2xl sm:text-3xl md:text-4xl text-center shrink-0">Pokémon Popularity Poll!</h1>

            <div className="flex flex-col items-center w-full px-2 mb-4">
                <div className="flex flex-col md:flex-row justify-around items-center md:items-start w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl gap-3 md:gap-4">
                    {/* Pokemon A Card */}
                    <PokemonCard
                        pokemon={pokemonA}
                        votesCount={votesACount}
                        onVote={onVotePokemonA}
                        isAuthenticated={isAuthenticated}
                        isWinning={showWinningA}
                        buttonColorClass="bg-green-500 hover:bg-green-600"
                    />

                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400 self-center my-2 md:my-2 shrink-0">VS.</div>

                    {/* Pokemon B Card */}
                    <PokemonCard
                        pokemon={pokemonB}
                        votesCount={votesBCount}
                        onVote={onVotePokemonB}
                        isAuthenticated={isAuthenticated}
                        isWinning={showWinningB}
                        buttonColorClass="bg-blue-500 hover:bg-blue-600"
                    />
                </div>
            </div>

            {isAuthenticated && (
                <motion.button
                    onClick={onEndPoll}
                    className="py-2 px-4 sm:px-5 text-sm sm:text-base cursor-pointer bg-red-500 text-white border-none rounded-md transition-colors duration-200 ease-in-out hover:bg-red-600 mt-8 mb-2 sm:mb-4 shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    End Battle!
                </motion.button>
            )}
        </motion.div>
    );
};

export default ActivePollDisplay;
