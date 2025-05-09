# Pokémon Battle Royale - React Assessment

## 📌 Goal

This project is a React application created for the Synca React assessment. The core functionality allows users to compare two Pokémon, vote for their favorite, and see real-time vote updates from all users. The application demonstrates proficiency in React, API integration, real-time data synchronization using serverless WebSockets, and state management.

The live application can be seen in the screenshot below, showcasing a battle between Zacian and Mew:

![Application Screenshot](https://i.gyazo.com/776953d6f9dbdc62d28a36df5a9153bb.png)

A full working demo of the application is available at: [https://olixis.github.io/synca-challenge/](https://olixis.github.io/synca-challenge/)

## ✨ Features & Technologies

This project leverages a modern web development stack:

*   **Frontend Framework:** React
*   **State Management & Data Fetching:** TanStack Query (React Query) for managing server state, caching, and simplifying data fetching logic.
*   **Real-time Backend & Database:** Convex, providing a serverless backend platform with real-time database capabilities and WebSocket communication out-of-the-box. This enables live vote syncing without managing a separate WebSocket server.
*   **Styling:** Tailwind CSS for utility-first styling, enabling rapid UI development.
*   **Animations:** Framer Motion for smooth UI transitions and animations.
*   **Notifications:** React Hot Toast for user-friendly in-app notifications.
*   **Build Tool:** Vite

## ✅ Assessment Requirements Fulfillment

Here's a breakdown of how the project addresses the specific requirements of the assessment:

### 1. Live Pokémon Display
*   **Pokémon Comparison:**
    *   The application allows users to initiate a battle by inputting the names of any two Pokémon, offering more flexibility than a hardcoded comparison (e.g., the assessment's example of Bulbasaur vs Pikachu).
    *   If no active poll is present, users are prompted with a form to create a new battle.
*   **Data Fetching & Display (via PokéAPI through Convex backend):**
    *   **Name:** Displayed for each Pokémon.
    *   **Sprite Image:** Displayed for each Pokémon.
    *   **Weight, Height, Base Experience:** Displayed for each Pokémon.
    *   *(Fulfilled)*

### 2. Voting System
*   **User Voting:**
    *   Users can vote for either of the two Pokémon in an active poll.
    *   To ensure a fair poll and prevent multiple votes for the same poll instance from a single user, voting is restricted based on the client's IP address. A user can only vote once per poll from the same IP.
    *   *(Fulfilled, with IP-based "vote once" logic)*
*   **Post-Vote Display:**
    *   **Total votes per Pokémon:** Clearly displayed and updated in real-time.
    *   **Highlight current winner:** The Pokémon with more votes is visually highlighted with a "Winning!" badge and a subtle animation.
    *   **Percentages or simple bar chart:** This specific visualization (percentages/bar chart) is **not currently implemented**. Vote counts are displayed directly.
    *   *(Partially fulfilled - winner and counts shown, but not percentages/bar chart)*

### 3. Real-time Vote Syncing
*   **Live Vote Changes:** All connected users see vote updates in real-time as other users cast their votes. This is achieved through Convex's real-time database and reactive query capabilities.
    *   *(Fulfilled)*
*   **WebSocket Usage:**
    *   Convex utilizes WebSockets under the hood to provide its real-time features, abstracting away the need for manual WebSocket server setup and management.
    *   **Ephemeral Connection:**
        *   Convex manages WebSocket connections automatically. Connections are established when components using Convex queries mount.
        *   Connections are closed when the browser tab is closed. While there isn't an explicit "disconnect after vote" client-side call, the IP-based voting restriction effectively makes further voting actions from that user for that poll moot.
    *   **Serverless WebSocket:** Achieved through Convex's platform.
    *   *(Fulfilled, managed by Convex)*

### 4. React State Management
*   **State Management Tools:** The project primarily uses React's built-in hooks (`useState`, `useEffect`) in conjunction with TanStack Query for managing server state (API data, votes) and local UI state.
*   **Clean and Predictable State:**
    *   TanStack Query helps in cleanly separating server state concerns (fetching, caching, synchronization of Pokémon data and votes).
    *   Custom hooks (`useVoteForPokemonMutation`, `useEndPollMutation`, `useCreatePollMutation`, `useActivePollQuery`, etc.) are used to encapsulate data fetching and mutation logic, promoting reusability and separation of concerns.
    *   Component state (`useState`) is used for managing form inputs and UI-specific states (e.g., `isCreatingPoll`).
    *   *(Fulfilled)*

### Bonus (Optional)
*   **"New Battle" Button:**
    *   The "End Battle!" button allows an authenticated user to terminate the current poll.
    *   Once a poll ends (or if no poll is active), the UI presents a form (`CreatePollForm.tsx`) allowing users to input two new Pokémon names to start a new battle. This fulfills the "New Battle" functionality.
    *   *(Fulfilled)*
*   **Smooth Animation:** Framer Motion is used for:
    *   Animating the appearance/disappearance of the create poll form and active poll display.
    *   Animating the vote count updates on Pokémon cards.
    *   Animating the "Winning!" Pokémon's sprite.
    *   Button hover and tap effects.
    *   *(Fulfilled)*
*   **Show Warning if Same User Tries to Vote Again from a Different Tab:** This is implicitly handled by the IP-based voting restriction. If a user has already voted in a poll, attempting to vote again from any tab (using the same IP address) for that *same poll instance* will be prevented by the backend logic (via Convex).
    *   *(Fulfilled, via IP-based check)*

### 🧪 Evaluation Rubric Adherence (Self-Assessment)
*   **React Architecture:** Components are structured logically (`PokemonPoll.tsx` as the main orchestrator, with `ActivePollDisplay.tsx`, `PokemonCard.tsx`, and `CreatePollForm.tsx` as presentational/functional sub-components). Custom hooks are used for data logic.
*   **API Usage:** Pokémon data is fetched (via Convex backend which calls PokéAPI) and displayed correctly.
*   **Real-time Sync:** Vote results update live across clients using Convex.
*   **Voting Logic:** One vote per user (IP-based) per poll, visible feedback, and winner highlighting are implemented.
*   **Error Handling:** Loading states are handled during data fetching. `react-hot-toast` is used for providing feedback to the user (e.g., on errors during IP fetching or poll creation).
*   **Bonus Creativity:** "New Battle" functionality and UI animations/transitions enhance the user experience. The UI presented in the screenshot is clean and intuitive.

## 📝 Important Note on Authentication

For the purpose of this assessment and to save development time, **user authentication has been mocked**. The `isAuthenticated` flag in `PokemonPoll.tsx` is currently hardcoded to `true`.

Instead of full user accounts, **user uniqueness for voting is primarily based on the client's IP address**. This is a simplified approach suitable for a demo/assessment but would require a more robust authentication system for a production application.

## 🚀 Potential Future Enhancements
*   Implement full user authentication.
*   Add vote percentages or a visual bar chart.
*   Allow selection of random Pokémon for a "Quick Battle" feature.
*   Persist poll results beyond the ephemeral WebSocket connection if desired.
*   More comprehensive test coverage.

---

