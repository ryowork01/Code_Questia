"use client"

import { useState } from "react"
import { useGame } from "@/components/game-state"
import { RPGWindow, RPGButton, RPGBar } from "@/components/rpg-window"

interface Enemy {
  name: string
  hp: number
  maxHp: number
  attack: number
  defense: number
  image: string
}

{/* 敵データ */}
const ENEMIES: Enemy[] = [
  { name: "スライム", hp: 15, maxHp: 15, attack: 3, defense: 1, image: "/enemies/enemy_slime.png" },
  //{ name: "オーク", hp: 25, maxHp: 25, attack: 5, defense: 2 }, 後で追加
  //{ name: "ドラゴン", hp: 50, maxHp: 50, attack: 8, defense: 4 }, 後で追加
]


{/* 戦闘処理 */}
export function BattlePage() {
  const { gameState, setPage, setMessage, gainExp, takeDamage } = useGame()
  const [enemy, setEnemy] = useState<Enemy>(ENEMIES[0])
  const [battleLog, setBattleLog] = useState<string[]>([
    `${enemy.name} が あらわれた！`,
  ])
  const [battleActive, setBattleActive] = useState(true)

  const pushLog = (msg: string) =>
    setBattleLog((prev) => [...prev, msg])

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * 12) + 5
    const newHp = Math.max(0, enemy.hp - damage)
    pushLog(`ゆうしゃの こうげき！ ${damage} の ダメージ！`)

    if (newHp <= 0) {
      const exp = Math.floor(enemy.maxHp * 1.5)
      gainExp(exp)
      pushLog(`${enemy.name} を たおした！ ${exp} のけいけんち！`)
      setMessage(`${enemy.name} を たおした！`)
      setBattleActive(false)
      return
    }

    setEnemy((prev) => ({ ...prev, hp: newHp }))

    setTimeout(() => {
      const enemyDamage = Math.floor(Math.random() * 8) + 2
      takeDamage(enemyDamage)
      pushLog(`${enemy.name} の こうげき！ ${enemyDamage} の ダメージ！`)

      if (gameState.character.hp - enemyDamage <= 0) {
        setMessage("ゆうしゃは ちからつきた…")
        setBattleActive(false)
      }
    }, 500)
  }

  const handleFlee = () => {
    pushLog("ゆうしゃは にげだした！")
    setMessage("にげだした。")
    setBattleActive(false)
    setTimeout(() => setPage("home"), 1200)
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center bg-cover bg-center bg-rpg-dark"
      style={{ backgroundImage: "url(/backgrounds/battle.jpg)" }}
    >
      {/* 敵表示 */}
      <div className="text-center mt-6 enemy-appear">
        <p className="text-3xl text-cyan-300 font-bold font-mono tracking-widest">
          ■ {enemy.name} ■
        </p>

        {/* 敵画像 */}
        <div className="w-full flex justify-center mt-3">
          <img
            src={enemy.image}
            alt={enemy.name}
            className="enemy-sprite"
            style={{ imageRendering: "pixelated"}}
          />
        </div>  
        
      </div>

      {/* バトルログ（中央） */}
      <div className="w-full max-w-lg mt-6">
        <RPGWindow title="たたかいのきろく">
          <div className="h-44 overflow-y-auto px-2 space-y-1">
            {battleLog.map((line, idx) => (
              <p key={idx} className="text-xs text-cyan-400 font-mono">
                ▶ {line}
              </p>
            ))}
          </div>
        </RPGWindow>
      </div>

      {/* ステータス（ゆうしゃ & 敵） */}
      <div className="w-full max-w-lg px-4">
        <div className="grid grid-cols-2 gap-4">
          <RPGWindow title="ゆうしゃ">
            <RPGBar
              label="ＨＰ"
              current={gameState.character.hp}
              max={gameState.character.maxHp}
              color="cyan"
            />
          </RPGWindow>

          <RPGWindow title={enemy.name}>
            <RPGBar
              label="ＨＰ"
              current={enemy.hp}
              max={enemy.maxHp}
              color="pink"
            />
          </RPGWindow>
        </div>
      </div>

      {/* コマンド（画面下固定） */}
      <div className="w-full max-w-md mb-6">
        {battleActive ? (
          <RPGWindow title="コマンド">
            <div className="grid grid-cols-2 gap-2">
              <RPGButton onClick={handleAttack} className="w-full text-left rpg-menu-item">
                ▶ こうげき
              </RPGButton>
              <RPGButton onClick={handleFlee} className="w-full text-left rpg-menu-item">
                ▶ にげる
              </RPGButton>
            </div>
          </RPGWindow>
        ) : (
          <RPGButton
            onClick={() => setPage("home")}
            className="w-full mt-3 rpg-menu-item"
          >
            ▶ ホームにもどる
          </RPGButton>
        )}
      </div>

      <style jsx>{`
        .enemy-appear {
          animation: fadeIn 1.2s ease-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .rpg-menu-item:hover {
          filter: brightness(1.25);
          transform: translateX(6px);
          transition: 0.15s;
        }
        .enemy-sprite {
          width: 160px;
          height: auto;
          animation: float 2.4s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px);
          50% { transform: translateY(-6px);
          100% { transform: translateY(0px);}
      `}</style>
    </div>
  )
}
