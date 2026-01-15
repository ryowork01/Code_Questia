// ライセンス表記ページ
"use client";

import { useRouter } from "next/navigation"
import { RPGButton } from "@/components/rpg-window";


export default function CreditsPage() {
	const router = useRouter();

	return (
		<main className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center bg-rpg-dark p-6" 
		style={{ backgroundImage: "url(/backgrounds/credits.jpg)" }}>
			<h2 className="text-4xl font-bold mb-4">クレジット / ライセンス表記</h2>

			<section className="mb-6">
				<h3 className="text-xl font-semibold mb-2">利用素材</h3>
				<ul className="list-disc ml-6 space-y-1">
					<li>背景画像：ゲームまてりあるず様</li>
					<li>敵キャラクター：ぴぽや倉庫様</li>
					<li>BGM / SE：魔王魂様</li>
				</ul>
			</section>

			<section>
				<h3 className="text-xl font-semibold mb-2">注意事項</h3>
				<p>本アプリは素材提供者とは一切関係ありません。</p>
			</section>

			<RPGButton className="mt-8 px-6 py-2 rpg-menu-item" 
			onClick={() => {
				router.back();
			}}>
				もどる
			</RPGButton>
		</main>
	);
}
