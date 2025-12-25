// app/layout.tsx
import "./globals.css"
import type { Metadata } from "next"
import { GameProvider } from "@/components/game-state"

export const metadata: Metadata = {
  title: "RPG学習アプリ",
  description: "Dragon Quest-style RPG Learning App",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  )
}

