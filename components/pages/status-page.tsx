"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useGame } from "@/components/game-state"
import { RPGWindow, RPGButton, RPGBar } from "@/components/rpg-window"




export function StatusPage() {
  const { gameState, setPage, setMessage, setCharacter } = useGame()
  const { character } = gameState

  const [nameInput, setNameInput] = useState(character.name)
  const [saving, setSaving] = useState(false)

  
  
  
  
  const updatePlayerName = async (newName: string) => {
    if (!newName || newName.length > 10) {
      setMessage("なまえは 10もじ いないに してね。")
      return
    }

    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage("ログイン じょうたいを かくにん できない…")
        return
      }

      // ✅ user_id で UPDATE（RLSと完全一致）
      const { data, error } = await supabase
        .from("players")
        .update({ name: newName })
        .eq("id", character.id)
        .select("name")
        .single()

      if (error || !data) {
        console.error("update error:", error)
        setMessage("なまえの へんこうに しっぱいした…")
        return
      }

      // ✅ state も確実に更新
      setCharacter({
        ...gameState.character,
        name: data.name,
      })

      setMessage(`なまえを「${data.name}」に へんこうした！`)
    } finally {
      setSaving(false)
    }
  }







  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 text-cyan-100">

      <RPGWindow title={`${character.name} の ステータス`}>

        {/* LEVEL / EXP */}
        <div className="pb-3 border-b border-white/30">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-cyan-300">レベル</div>
              <div className="text-yellow-300 text-lg">{character.level}</div>
            </div>
            <div>
              <div className="text-cyan-300">けいけんち</div>
              <div className="text-yellow-300">
                {character.exp}/{character.nextLevelExp}
              </div>
            </div>
          </div>
        </div>

        {/* HP/MP */}
        <div>
          <RPGBar label="ＨＰ" current={character.hp} max={character.maxHp} />
          <RPGBar label="ＭＰ" current={character.mp} max={character.maxMp} />
        </div>

        {/* ステータス */}
        <div className="pb-3 border-b border-white/30">
          <div className="text-sm text-cyan-300 mb-2">ステータス</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>さいだいＨＰ: <span className="text-yellow-300">{character.maxHp}</span></div>
            <div>さいだいＭＰ: <span className="text-yellow-300">{character.maxMp}</span></div>
            <div>こうげき力: <span className="text-yellow-300">{character.level * 3}</span></div>
            <div>ぼうぎょ力: <span className="text-yellow-300">{character.level}</span></div>
          </div>
        </div>

        {/* 名前変更 */}
        <div className="mt-4 space-y-2 border-t border-white/30 pt-3">
          <div className="text-sm text-cyan-300">なまえを へんこう</div>

          <input
            className="w-full p-2 bg-black text-cyan-200 border border-cyan-700 dq-font"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            disabled={saving}
          />

          <div className="flex gap-2">
            <RPGButton className="w-full text-left rpg-menu-item" disabled={saving} onClick={() => updatePlayerName(nameInput)}>
              ▶ へんこう
            </RPGButton>

            <RPGButton className="w-full text-left rpg-menu-item" disabled={saving} onClick={() => updatePlayerName("勇者")}>
              ▶ もとに もどす
            </RPGButton>
          </div>
        </div>
      </RPGWindow>

      <RPGButton className="w-full text-left rpg-menu-item" onClick={() => setPage("home")}>
        ▶ もどる
      </RPGButton>
    </div>
  )
}

