"use client"

import { GameProvider } from "@/components/game-state";
import { HomePage } from "@/components/pages/home-page";

console.log("HomePage render");


export default function Page() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-rpg-dark text-rpg-text p-4">
        <HomePage />
      </main>
    </GameProvider>
  )
}
