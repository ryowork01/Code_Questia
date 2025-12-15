"use client"

import { GameProvider } from "@/components/game-state"
import { LogIn } from "@/components/pages/login-page"

export default function Page() {
  return (
	<GameProvider>
	  <main className="min-h-screen bg-rpg-dark text-rpg-text p-4">
		<LogIn />
	  </main>
	</GameProvider>
  )
}