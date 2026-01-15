"use client"

import { useEffect, useState } from "react"
import { useGame } from "@/components/game-state"
import { RPGWindow, RPGButton } from "@/components/rpg-window"
import { getRandomQuestion } from "@/lib/supabaseQuestions"

interface Question {
  id: string
  statement: string
  correct: boolean
  exp: number
  gold: number
  explanation: string
}

export function LearnPage() {
  const { gameState, setPage, setMessage, gainExp, gainGold, loadPlayerData } = useGame()

  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)

  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // 初回プレイヤーデータ読み込み
  useEffect(() => {
    loadPlayerData()
  }, [])

  // 初回問題取得
  useEffect(() => {
    loadNewQuestion()
  }, [])

  const loadNewQuestion = async () => {
    setLoading(true)
    const q = await getRandomQuestion()
    if (!q) {
      setMessage("もんだいを よみこめなかった…")
      setPage("home")
      return
    }
    setQuestion(q)
    setAnswered(false)
    setIsCorrect(null)
    setLoading(false)
  }

  if (loading || !question) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <RPGWindow title="よみこみちゅう">
          <p
            className="text-sm text-cyan-300"
            style={{ fontFamily: '"Courier New", monospace', letterSpacing: "0.05em" }}
          >
            もんだいを じゅんびしている…
          </p>
        </RPGWindow>
      </div>
    )
  }

  /* ---------------------------
   * 回答
   * --------------------------- */
  const handleAnswer = (userAnswer: boolean) => {
    if (answered) return

    const correct = userAnswer === question.correct
    setAnswered(true)
    setIsCorrect(correct)

    if (correct) {
      gainExp(question.exp)
      gainGold(question.gold)
      setMessage(`せいかい！${question.exp} の けいけんちと ${question.gold}G をもらった！`)
    } else {
      setMessage("ざんねん… まちがいだ。")
    }
  }

  /* ---------------------------
   * 次の問題
   * --------------------------- */
  const handleNext = () => {
    if (!answered) return
    loadNewQuestion()            // 🎯 次はランダム新規取得
  }

  /* ---------------------------
   * 中断
   * --------------------------- */
  const handleAbort = () => {
    setMessage("がくしゅうを ちゅうだんした。")
    setPage("home")
  }

  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-rpg-dark bg-fixed "
      style={{ backgroundImage: "url(/backgrounds/learn.jpg)" }}
    >
      {/* 暗幕 */}
      <div className="min-h-screen bg-black/60 w-full justify-center p-4">

      <RPGWindow title="○×クイズ - ランダムしゅつだい">
        <p
          className="text-sm text-cyan-400 mb-3"
          style={{
            fontFamily: '"Courier New", monospace',
            letterSpacing: "0.03em",
            fontWeight: 700,
          }}
        >
          ただしいと おもったら ○、ちがうと おもったら ×
        </p>

        <p
          className="text-xl text-yellow-300 mb-3"
          style={{
            fontFamily: '"Courier New", monospace',
            letterSpacing: "0.02em",
            fontWeight: 700,
          }}
        >
          Q: {question.statement}
        </p>

        {/* 判定後：解説 */}
        {answered && (
          <div className={`mb-4 p-3 rounded ${isCorrect ? "bg-green-900/50" : "bg-red-900/40"}`}>
            <div className="text-sm font-bold">
              {isCorrect ? "せいかい！" : "ふせいかい"}
            </div>
            <div className="text-xs mt-1 text-gray-200">
              {question.explanation}
            </div>
          </div>
        )}

        {/* 解答前 */}
        {!answered && (
        <div className="grid grid-cols-2 gap-3 mb-4 ">
          <RPGButton className="w-full flex-1 text-left rpg-menu-item" 
          onClick={() => handleAnswer(true)} disabled={answered}>
            〇 はい
          </RPGButton>

          <RPGButton className="w-full flex-1 text-left rpg-menu-item" 
          onClick={() => handleAnswer(false)} disabled={answered}>
            ✕ いいえ
          </RPGButton>
        </div>
        )}

        {/* 操作 */}
        {answered && (
        <div className="flex gap-2">
          <RPGButton className="w-full flex-1 text-left rpg-menu-item" 
          onClick={handleNext} disabled={!answered}>
            つぎへ
          </RPGButton>
          <RPGButton className="w-full flex-1 text-left rpg-menu-item" 
          onClick={handleAbort} >
            もどる
          </RPGButton>
        </div>
        )}

      </RPGWindow>

      <RPGWindow title="メッセージ">
        <p className="text-sm text-yellow-300 min-h-12">
          {gameState.message}
        </p>
      </RPGWindow>
    </div>
    </div>
  )
}
