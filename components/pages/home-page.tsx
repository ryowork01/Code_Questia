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

// =====================
// ログアウトボタン
// =====================
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
  const { gameState, setPage, setMessage, setCharacter, loadPlayerData } = useGame()

  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [playerLoaded, setPlayerLoaded] = useState(false)

  const setupDoneRef = useRef(false)

  useEffect(() => {
    loadPlayerData();
  }, []);

  // =====================
  // Auth 確定
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

  useEffect(() => {
    if (!authChecked) return
    if (setupDoneRef.current) return

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
          gold: finalPlayer.gold,
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


  if (gameState.currentPage === "learn") return <LearnPage />
  if (gameState.currentPage === "battle") return <BattlePage />
  if (gameState.currentPage === "status") return <StatusPage />
  if (gameState.currentPage === "skillboard") return <SkillBoardPage />

  if (!authChecked || !playerLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-cyan-300">
        セーブデータを よみこんでいます…
      </div>
    )
  }

  const isGuest = user?.is_anonymous === true

  // UI（背景＋透過処理込み）
  return (
    <>
      <div
        className="min-h-screen flex bg-cover bg-center bg-fixed "
        style={{ backgroundImage: "url(/backgrounds/home.jpg)" }}
      >
        {/* 暗幕 */}
        <div className="min-h-screen bg-black/60 w-full justify-center p-4">

          <div className="text-center mb-1">
            <h1 className="text-3xl text-cyan-300 mb-2 retro-title">
              ＲＰＧがくしゅうアプリ
            </h1>
            <p className="text-cyan-400 text-xs">
              ▼ しれんに たちむかおう ▼
            </p>
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

          <RPGWindow title="メッセージ">
            <p className="text-sm text-yellow-300 min-h-12">
              {gameState.message}
            </p>
          </RPGWindow>

          <RPGWindow title="コマンド">
            <RPGButton className="w-full text-left rpg-menu-item" onClick={() => setPage("learn")}>
              ▶ まなぶ
            </RPGButton>

            <RPGButton
              className="w-full text-left rpg-menu-item"
              onClick={() => {
                if (gameState.character.hp <= 0) {
                  setMessage("ＨＰが ０ なので たたかえない！ やくそうをつかおう！")
                  return
                }
                setPage("battle")
              }}
            >
              ▶ たたかう
            </RPGButton>

            <RPGButton className="w-full text-left rpg-menu-item" onClick={() => setPage("status")}>
              ▶ ステータス
            </RPGButton>

            <RPGButton className="w-full text-left rpg-menu-item" onClick={() => setPage("skillboard")}>
              ▶ スキルボード
            </RPGButton>

            <RPGButton className="w-full text-left rpg-menu-item" onClick={() => router.push("/shop")}>
              ▶ どうぐ屋
            </RPGButton>

            {isGuest && (
              <RPGButton onClick={() => router.push("/upgrade")}>
                ▶ 本登録する
              </RPGButton>
            )}

            <LogoutButton />
          </RPGWindow>
        </div>
      </div>
    </>
  )
}
  