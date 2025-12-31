"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skill, useGame } from "@/components/game-state";
import { RPGWindow, RPGButton } from "@/components/rpg-window";
import { useRouter } from "next/navigation";

export type ShopItem = {
	id: string;
	name: string;
	description: string;
	price: number;
	heal_value: number | null;
};

// ▼ items テーブルから取得
const fetchItems = async (): Promise<ShopItem[]> => {
	const { data, error } = await supabase.from("items").select("*");

	if (error) {
		console.error("Failed to load items:", error);
		return [];
	}

	return (data ?? []) as ShopItem[];
};



export default function ShopPage() {
	const { gameState, setMessage, addItem, loadPlayerData, gainGold } = useGame();
	const player = gameState.character;
	const [items, setItems] = useState<ShopItem[]>([]);
	const router = useRouter();

	


	// 一度だけ商品一覧を取得
	useEffect(() => {
		fetchItems().then((list) => setItems(list));
		loadPlayerData();
	}, []);


	
	// 購入処理
	const buyItem = async (item: ShopItem) => {
		if (gameState.character.gold < item.price) {
			setMessage("おかねが たりない！");
			return;
		}

		await gainGold(-item.price);
		addItem(item.id);

		// ❌ await fetchPlayer() は削除
		// ⭕ DB と UI を同期する
		await loadPlayerData();

		setMessage(`${item.name} を１つてにいれた！`);
	}



		
		

	return (
		<main
			className="min-h-screen flex bg-cover bg-center bg-fixed bg-rpg-dark text-rpg-text p-4"
			style={{
				backgroundImage: "url(/backgrounds/shop.jpg)",
			}}
		>
			<RPGWindow title="どうぐ屋">
				{/* 🪙 所持金表示 追加 */}
				<div className="mb-4 text-right text-yellow-300 font-bold text-lg">
					所持金：{player.gold} G
				</div>

				<ul className="space-y-3 text-cyan-200">
					{items.length === 0 && <p>商品がありません</p>}

					{items.map((item) => (
						<li key={item.id} className="flex justify-between">
							<div>
								<strong>{item.name}</strong>
								<p className="text-xs opacity-80">{item.description}</p>
							</div>
							<RPGButton onClick={() => buyItem(item)}
								className="rpg-menu-item"
								>
								💰 {item.price}G で買う
							</RPGButton>
						</li>
					))}
				</ul>

				<RPGWindow title="メッセージ">
					<p className="text-sm text-yellow-300 min-h-12">
						{gameState.message}
					</p>
				</RPGWindow>

				<RPGButton
					onClick={() => router.push("/home")}
					className="dq-button rpg-menu-item mt-4"
				>
					◀ ホームへもどる
				</RPGButton>
			</RPGWindow>
		</main>
	);
}


