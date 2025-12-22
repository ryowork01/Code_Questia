"use client"

import { useEffect, useState, useRef } from "react"
import { useGame } from "@/components/game-state"
import { RPGWindow, RPGBar, RPGButton } from "@/components/rpg-window"
import { LearnPage } from "./learn-page"
import { BattlePage } from "./battle-page"
import { StatusPage } from "./status-page"
import SkillBoardPage from "@/components/pages/skillboard-page"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"


//ログアウトボタン設定
export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <RPGButton className="w-full text-left rpg-menu-item" onClick={logout}>
      ▶ ログアウト
    </RPGButton>
  )
}

export function HomePage() {
  const router = useRouter()
  const { gameState, setPage, setMessage, setCharacter } = useGame()

  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [playerLoaded, setPlayerLoaded] = useState(false)

  // 🔒 二重実行防止
  const setupDoneRef = useRef(false)

  // =====================
  // Auth 確定処理
  // =====================
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setAuthChecked(true)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      setAuthChecked(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  // =====================
  // Player セットアップ
  // =====================
  useEffect(() => {
    if (!authChecked) return
    if (setupDoneRef.current) return

    // 🔑 ログインしていない場合も必ず抜ける
    if (!user) {
      setPlayerLoaded(true)
      setupDoneRef.current = true
      return
    }

    const setupPlayer = async () => {
      try {
        const { data: player } = await supabase
          .from("players")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        let finalPlayer = player

        if (!player) {
          const { data: newPlayer } = await supabase
            .from("players")
            .insert({ user_id: user.id })
            .select()
            .single()

          finalPlayer = newPlayer
        }

        setCharacter({
          id: finalPlayer.id,
          name: finalPlayer.name,
          level: finalPlayer.level,
          hp: finalPlayer.hp,
          maxHp: finalPlayer.max_hp,
          mp: finalPlayer.mp,
          maxMp: finalPlayer.max_mp,
          exp: finalPlayer.exp,
          nextLevelExp: 100,
          skills: [],
          gold: 0
        })

        setMessage(`ようこそ ${finalPlayer.name}！`)
      } catch (e) {
        console.error("player setup error", e)
      } finally {
        setPlayerLoaded(true)
        setupDoneRef.current = true
      }
    }

    setupPlayer()
  }, [authChecked, user, setCharacter, setMessage])

  // =====================
  // ページ切り替え
  // =====================
  if (gameState.currentPage === "learn") return <LearnPage />
  if (gameState.currentPage === "battle") return <BattlePage />
  if (gameState.currentPage === "status") return <StatusPage />
  if (gameState.currentPage === "skillboard") return <SkillBoardPage />

  // =====================
  // Loading
  // =====================
  if (!authChecked || !playerLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-cyan-300">
        セーブデータを よみこんでいます…
      </div>
    )
  }

  const isGuest = user?.is_anonymous === true

  // =====================
  // UI
  // =====================
  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 bg-[#1b1d2b] min-h-screen text-cyan-100">
      <div className="text-center mb-6">
        <h1 className="text-3xl text-cyan-300 mb-2 retro-title">
          ＲＰＧがくしゅうアプリ
        </h1>
        <p className="text-cyan-400 text-xs">▼ しれんに たちむかおう ▼</p>
      </div>

      <RPGWindow title={gameState.character.name}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <RPGBar label="ＨＰ" current={gameState.character.hp} max={gameState.character.maxHp} />
            <RPGBar label="ＭＰ" current={gameState.character.mp} max={gameState.character.maxMp} />
          </div>
          <div className="text-sm text-cyan-300 space-y-2">
            <div>ＬＶ：{gameState.character.level}</div>
            <div>ＥＸＰ：{gameState.character.exp}/{gameState.character.nextLevelExp}</div>
            <div>ゴールド：{gameState.character.gold} G</div>
            <div>スキル：{gameState.character.skills.length}</div>
          </div>
        </div>
      </RPGWindow>

      <RPGWindow title="コマンド">
        <RPGButton className="w-full text-left rpg-menu-item" onClick={() => setPage("learn")}>▶ まなぶ</RPGButton>
        <RPGButton className="w-full text-left rpg-menu-item" onClick={() => setPage("battle")}>▶ たたかう</RPGButton>
        <RPGButton className="w-full text-left rpg-menu-item" onClick={() => setPage("status")}>▶ ステータス</RPGButton>
        <RPGButton className="w-full text-left rpg-menu-item" onClick={() => setPage("skillboard")}>▶ スキルボード</RPGButton>

        {isGuest && (
          <RPGButton onClick={() => router.push("/upgrade")}>
            ▶ 本登録する
          </RPGButton>
        )}

        <LogoutButton />
      </RPGWindow>
    </div>
  )
}
