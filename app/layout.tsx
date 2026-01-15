// app/layout.tsx
import "./globals.css"
import type { Metadata } from "next"
import { GameProvider } from "@/components/game-state"
import Link from "next/link"
import { BGMProvider } from "@/components/bgm-context"

export const metadata: Metadata = {
  title: "Code Questia",
  description: "Dragon Quest-style RPG Learning App",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <GameProvider>
          <BGMProvider>
          {children}
          </BGMProvider>
        </GameProvider>
      </body>
    </html>
  )
}




