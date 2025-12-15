"use client"

import { GameProvider } from "@/components/game-state"
import { RPGWindow, RPGButton, RPGBar } from "@/components/rpg-window"

export function LogIn() {
  return (
	<GameProvider>
	  <main className="min-h-screen bg-rpg-dark text-rpg-text p-4">
		<RPGWindow>
		  <div className="text-center text-lg mb-4">ログインページ（未実装）</div>
		  <RPGButton className="rpg-menu-item w-full">▶ ログイン（未実装）</RPGButton>
		  <RPGBar label={""} current={0} max={0} />
		  <RPGButton className="rpg-menu-item w-full">▶ パスワードを忘れた場合（未実装）</RPGButton>	
		</RPGWindow>
	  </main>
	</GameProvider>
  )
}