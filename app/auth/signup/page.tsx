"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { RPGWindow, RPGButton } from "@/components/rpg-window"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // =====================
  // バリデーション
  // =====================
  const validate = () => {
    if (!email) {
      setError("メールアドレスを入力してください")
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("メールアドレスの形式が正しくありません")
      return false
    }

    if (!password) {
      setError("パスワードを入力してください")
      return false
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください")
      return false
    }

    return true
  }

  // =====================
  // サインアップ処理
  // =====================
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!validate()) {
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setError("確認メールを送信しました")
    } catch (error: any) {
      console.error("サインアップエラー:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <RPGWindow title="新規登録">
        <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-1 text-white">メールアドレス</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-white">パスワード</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <RPGButton
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "登録中..." : "アカウント作成"}
          </RPGButton>

          <RPGButton
            type="button"
            onClick={() => router.push("/")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
          >
            トップページに戻る
          </RPGButton>
        </form>
      </RPGWindow>
    </div>
  )
}


