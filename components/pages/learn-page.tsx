"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useGame } from "@/components/game-state"
import { RPGWindow, RPGButton } from "@/components/rpg-window"

interface Question {
  id: string
  statement: string
  correct: boolean
  exp: number
  explanation: string
}

export function LearnPage() {
  const { setPage, setMessage, gainExp, gainGold } = useGame()

  // Supabase から取得した問題
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  // 出題制御
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  /* ---------------------------
   * 問題取得（初回のみ）
   * --------------------------- */
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, statement, correct, exp, explanation")
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(10)

      if (error || !data || data.length === 0) {
        setMessage("もんだいを よみこめなかった…")
        setPage("home")
        console.log("Error fetching questions:", error)
        return
      }

      setQuestions(data as Question[])
      setLoading(false)
    }

    fetchQuestions()
  }, [setMessage, setPage])

  /* ---------------------------
   * ローディング表示
   * --------------------------- */
  if (loading) {
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

  const current = questions[index]

  /* ---------------------------
   * 回答処理
   * --------------------------- */
  const handleAnswer = (userAnswer: boolean) => {
    if (answered) return

    const correct = userAnswer === current.correct
    setAnswered(true)
    setIsCorrect(correct)

    if (correct) {
      gainExp(current.exp)
      gainGold(10)  // 正解時にゴールドを10獲得
      setMessage(`せいかい！${current.exp} の けいけんちと 10G をえた！`)
    } else {
      setMessage("ざんねん… まちがいだ。")
    }
  }

  /* ---------------------------
   * 次の問題へ
   * --------------------------- */
  const handleNext = () => {
    if (!answered) return

    const next = index + 1
    if (next >= questions.length) {
      setMessage("すべての もんだいが しゅうりょうした！")
      setTimeout(() => setPage("home"), 800)
      return
    }

    setIndex(next)
    setAnswered(false)
    setIsCorrect(null)
  }

  /* ---------------------------
   * 中断
   * --------------------------- */
  const handleAbort = () => {
    setMessage("がくしゅうを ちゅうだんした。")
    setPage("home")
  }

  /* ---------------------------
   * UI
   * --------------------------- */
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <RPGWindow title={`○×クイズ (${index + 1}/${questions.length})`}>
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
          className="text-sm text-yellow-300 mb-3"
          style={{
            fontFamily: '"Courier New", monospace',
            letterSpacing: "0.02em",
            fontWeight: 700,
          }}
        >
          Q: {current.statement}
        </p>

        {/* 判定後：解説 */}
        {answered && (
          <div className={`mb-4 p-3 rounded ${isCorrect ? "bg-green-900/50" : "bg-red-900/40"}`}>
            <div className="text-sm font-bold">
              {isCorrect ? "せいかい！" : "ふせいかい"}
            </div>
            <div className="text-xs mt-1 text-gray-200">
              {current.explanation}
            </div>
          </div>
        )}

        {/* 回答ボタン */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <RPGButton
            onClick={() => handleAnswer(true)}
            className="rpg-menu-item"
            disabled={answered}
          >
            ○ そうだ
          </RPGButton>

          <RPGButton
            onClick={() => handleAnswer(false)}
            className="rpg-menu-item"
            disabled={answered}
          >
            × ちがう
          </RPGButton>
        </div>

        {/* 操作 */}
        <div className="flex gap-2">
          <RPGButton
            onClick={handleNext}
            className="flex-1 rpg-menu-item"
            disabled={!answered}
          >
            {index + 1 >= questions.length ? "しゅうりょう" : "つぎへ"}
          </RPGButton>

          <RPGButton onClick={handleAbort} className="flex-1 rpg-menu-item">
            もどる
          </RPGButton>
        </div>
      </RPGWindow>

      <style jsx>{`
        .rpg-menu-item:hover {
          filter: brightness(1.3);
          transform: translateX(6px);
          transition: 0.15s;
        }
      `}</style>
    </div>
  )
}
function gainGold(arg0: number) {
  throw new Error("Function not implemented.")
}

