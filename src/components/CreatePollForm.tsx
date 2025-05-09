import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { handleCreatePollUtil } from '../utils/pollUtils';
import type { CreatePollFormProps } from '../types';

const CreatePollForm: React.FC<CreatePollFormProps> = ({
    createPollAction
}) => {
    const [pokemonAName, setPokemonAName] = useState("");
    const [pokemonBName, setPokemonBName] = useState("");
    const [isCreatingPoll, setIsCreatingPoll] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Call the utility function, passing component state, setters, and the action
        await handleCreatePollUtil(
            pokemonAName,
            pokemonBName,
            createPollAction,
            setIsCreatingPoll,
            setPokemonAName, // Pass the state setter for clearing the field
            setPokemonBName  // Pass the state setter for clearing the field
        );
    };

    return (
        <motion.div
            key="create-poll-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center font-sans p-4 sm:p-5 bg-transparent pt-12 md:pt-16"
        >
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="mb-4 sm:mb-6 text-white font-bold text-2xl sm:text-3xl md:text-4xl text-center shrink-0">Start a New Pokémon Battle!</h1>
            <motion.form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-xl"
            >
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
                    <motion.button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                        disabled={isCreatingPoll}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isCreatingPoll ? 'Starting...' : 'Start Battle!'}
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
};

export default CreatePollForm;