"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useGame } from "@/components/game-state";
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
	const { data, error } = await supabase
	.from("items")
	.select("*");

	if (error) {
		console.error("Failed to load items:", error);
		return [];
	}

	return (data ?? []) as ShopItem[];
};

export default function ShopPage() {
	const { gameState, setMessage, setCharacter, addItem, setPage } = useGame();
	const player = gameState.character;
	const [items, setItems] = useState<ShopItem[]>([]);
	const router = useRouter();

	// 一度だけ商品一覧を取得
	useEffect(() => {
		fetchItems().then((list) => setItems(list));
	}, []);

	// ▼ 購入処理
	const buyItem = async (item: ShopItem) => {
		if (player.gold < item.price) {
			setMessage("おかねがたりない！");
			return;
		}

		const newGold = player.gold - item.price;

		// ローカル state 更新
		addItem(item.id);
		setCharacter({
			...player,
			gold: newGold,
		});

		// Supabase 更新（金額）
		const { error: goldErr } = await supabase
			.from("players")
			.update({ gold: newGold })
			.eq("id", player.id);
		if (goldErr) console.error("Gold update error:", goldErr);

		// アイテム所持の Supabase 反映
		const { data: existing } = await supabase
			.from("player_items")
			.select("*")
			.eq("player_id", player.id)
			.eq("item_id", item.id)
			.maybeSingle();

		if (!existing) {
			await supabase.from("player_items").insert({
				player_id: player.id,
				item_id: item.id,
				quantity: 1,
			});
		} else {
			await supabase
				.from("player_items")
				.update({ quantity: existing.quantity + 1 })
				.eq("id", existing.id);
		}

		setMessage(`${item.name} を１つてにいれた！`);
	};



	return (
		<main
			className="min-h-screen flex bg-cover bg-center bg-fixed bg-rpg-dark text-rpg-text p-4"
			style={{
				backgroundImage: "url(/backgrounds/shop.jpg)",
			}}
		>
			<RPGWindow title="どうぐ屋">
				<ul className="space-y-3 text-cyan-200">
					{items.length === 0 && <p>商品がありません</p>}

					{items.map((item) => (
						<li key={item.id} className="flex justify-between">
							<div>
								<strong>{item.name}</strong>
								<p className="text-xs opacity-80">{item.description}</p>
							</div>
							<RPGButton onClick={() => buyItem(item)}>
								💰 {item.price}G で買う
							</RPGButton>
						</li>
					))}
				</ul>

				<RPGButton
					onClick={() => 
						router.push("/home")
					}
					className="dq-button rpg-menu-item mt-4"
				>
					◀ ホームへもどる
				</RPGButton>
			</RPGWindow>
		</main>
	);
}
