import React from 'react';
import { motion } from 'framer-motion';
import type { PokemonCardProps } from '../types';

const PokemonCard: React.FC<PokemonCardProps> = ({
    pokemon,
    votesCount,
    onVote,
    isAuthenticated,
    isWinning,
    buttonColorClass = 'bg-gray-500 hover:bg-gray-600'
}) => {
    return (
        <div className="flex flex-col items-center">
            <div className={`text-2xl font-bold text-yellow-400 mb-2 animate-pulse ${isWinning ? 'visible' : 'invisible'}`}>
                Winning!
            </div>
            <div className="text-center p-3 sm:p-4 border border-gray-700 rounded-xl w-full bg-white shadow-lg">
                <img src={pokemon.spriteImgUrl} alt={pokemon.name} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-2" />
                <h2 className="my-1 text-gray-800 font-bold text-lg sm:text-xl md:text-xl">{pokemon.name.toUpperCase()}</h2>
                <p className="text-xs sm:text-sm text-gray-700">Weight: {pokemon.weight} | Height: {pokemon.height}</p>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">Base Exp: {pokemon.baseExp}</p>
                <p className="text-base sm:text-lg font-bold text-gray-800 my-1 sm:my-2">
                    Votes:{" "}
                    {typeof votesCount === 'number' ? (
                        <motion.span
                            key={`votes-${pokemon._id}-${votesCount}`}
                            initial={{ scale: 5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{ display: 'inline-block' }}
                        >
                            {votesCount}
                        </motion.span>
                    ) : (
                        votesCount
                    )}
                </p>
                {isAuthenticated ? (
                    <motion.button
                        onClick={onVote}
                        className={`py-1.5 px-3 text-xs sm:text-sm cursor-pointer text-white border-none rounded-md transition-colors duration-200 ease-in-out ${buttonColorClass}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Vote for {pokemon.name}
                    </motion.button>
                ) : <p className="text-gray-600 text-xs sm:text-sm">Please log in to vote.</p>}
            </div>
        </div>
    );
};

export default PokemonCard;
