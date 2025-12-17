"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

type User = any
type AuthContextType = {
	user: User | null
	profile: any | null
	loading: boolean
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	profile: null,
	loading: true,
	signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

//認証情報をアプリ全体に提供
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [profile, setProfile] = useState<any | null>(null)
	const [loading, setLoading] = useState(true)

	//初回読み込み時の処理
	useEffect(() => {
		const fetchUser = async () => {
			try {
				//認証情報をsupabaseから取得
				const {
					data: { session },
				} = await supabase.auth.getSession()

				if (session?.user) {
					setUser(session.user)

					//プロフィール情報を取得
					const { data } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", session.user.id)
					.single()

					setProfile(data)
				}
			} catch (error) {
				console.error("認証情報取得エラー:", error)
			} finally {
				setLoading(false)
			}		
		}

		fetchUser()

		//認証状態変更のリスナー設定
		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				setUser(session.user)

				//プロフィール情報を取得
				const { data } = await supabase.from("profiles")
					.select("*")
					.eq("id", session.user.id)
					.single()

				setProfile(data)
			} else {
				setUser(null)
				setProfile(null)
			}
			setLoading(false)
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	//サインアウト処理
	const signOut = async () => {
		await supabase.auth.signOut()
		setUser(null)
		setProfile(null)
	}

	//コンテキストプロバイダーで子コンポーネントをラップ
	return <AuthContext.Provider value={{ user, profile, loading, signOut }}>{children}</AuthContext.Provider>
}
