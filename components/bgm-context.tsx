"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"

export type BGMContextType = {
	volume: number
	setVolume: (v: number) => void
	muted: boolean
	toggleMute: () => void
}

const BGMContext = createContext<BGMContextType | null>(null)

export function BGMProvider({ children }: { children: React.ReactNode }) {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const [volume, setVolume] = useState(0)
	const [muted, setMuted] = useState(true)

	useEffect(() => {
		const audio = new Audio("/bgm/bgm.mp3")
		audio.loop = true
		audio.volume = 0
		audioRef.current = audio
	}, [])

	useEffect(() => {
		if (!audioRef.current) return
		audioRef.current.volume = muted ? 0 : volume
	}, [volume, muted])

	const play = () => {
		audioRef.current?.play().catch(() => { })
	}

	const toggleMute = () => {
		setMuted((m) => {
			if (m) play()
			return !m
		})
	}

	return (
		<BGMContext.Provider value={{ volume, setVolume, muted, toggleMute }}>
			{children}
		</BGMContext.Provider>
	)
}

/** ← これは「フック」 */
export function useBGM() {
	const ctx = useContext(BGMContext)
	if (!ctx) throw new Error("useBGM must be used within BGMProvider")
	return ctx
}
