# Real-Time Pictionary Game

A multiplayer drawing and guessing game built with Next.js, Convex, and TypeScript. Players can create rooms, join existing ones, and compete in real-time drawing and guessing challenges.

![Pictionary Game](public/preview.png)

## Features

- 🎨 Real-time drawing canvas with multiple colors and brush sizes
- 🎮 Multiplayer support with room-based gameplay
- 🔒 Unique room IDs for easy sharing
- 💬 Live chat and guessing system
- 🏆 Score tracking for correct guesses
- 👥 Player presence detection
- 🎲 Random word selection
- ✏️ Role switching between drawer and guesser

## Tech Stack

- **Frontend**

  - [Next.js 14](https://nextjs.org/) - React framework
  - [TypeScript](https://www.typescriptlang.org/) - Type safety
  - [Tailwind CSS](https://tailwindcss.com/) - Styling
  - [shadcn/ui](https://ui.shadcn.com/) - UI components
- **Backend & Real-time Features**

  - [Convex](https://www.convex.dev/) - Backend and real-time database
  - WebSocket for live drawing updates
  - Real-time presence tracking

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Convex account (free tier available)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pictionary.git
   cd pictionary
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:

   - Copy `.env.example` to `.env.local`
   - Add your Convex deployment URL:

   ```
   NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
   ```
4. Initialize Convex:

   ```bash
   npx convex dev
   ```
5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Game Rules

1. **Creating a Room**

   - Click "Create Room"
   - Set room name and player limit
   - Share the room ID with friends
2. **Joining a Room**

   - Click "Join Room"
   - Enter the room ID
   - Enter your name
3. **Gameplay**

   - One player is randomly selected as the drawer
   - Drawer gets a random word to draw
   - Other players try to guess the word
   - Points are awarded for correct guesses
   - Roles switch after each round

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel:

   - `NEXT_PUBLIC_CONVEX_URL`: Your production Convex deployment URL
4. Deploy!

### Setting up Convex

1. Create a new project in [Convex dashboard](https://dashboard.convex.dev)
2. Deploy your Convex functions:

   ```bash
   npx convex deploy
   ```

## Project Structure

```
pictionary/
├── app/                  # Next.js app directory
├── components/          # React components
├── convex/              # Convex backend functions
├── lib/                 # Utility functions
└── public/              # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Real-time features powered by [Convex](https://www.convex.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
