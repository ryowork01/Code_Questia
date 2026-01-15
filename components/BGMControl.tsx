"use client"

import { useBGM } from "@/components/bgm-context"

export function BGMControl() {
	const { volume, setVolume, muted, toggleMute, play } = useBGM()

	const onClick = () => {
		play()
		toggleMute()
	}

	return (
		<div className="flex items-center gap-2 text-cyan-300 text-sm">
			<button onClick={onClick}>
				{muted ? "🔇" : "🔊"}
			</button>

			<input
				type="range"
				min="0"
				max="1"
				step="0.05"
				value={volume}
				onChange={(e) => setVolume(Number(e.target.value))}
				className="w-24"
			/>
		</div>
	)
}
