"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useGame } from "@/components/game-state";
import { RPGWindow, RPGButton } from "@/components/rpg-window";

export type ShopItem = {
	id: string;
	name: string;
	description: string;
	price: number;
	heal_value: number | null;
};

const fetchShopItems = async (): Promise<ShopItem[]> => {
	const { data, error } = await supabase
		.from("shop_items")
		.select(`
      item:items (
        id,
        name,
        description,
        price,
        heal_value
      )
    `);

	if (error) {
		console.error(error);
		return [];
	}

	const flat = (data ?? []).flatMap((row: any) => row.item);
	return flat as ShopItem[];
};

export default function ShopPage() {
	const { gameState, setMessage, setCharacter } = useGame();
	const player = gameState.character;
	const [items, setItems] = useState<ShopItem[]>([]);

	useEffect(() => {
		fetchShopItems().then((items) => setItems(items));
	}, []);

	const buyItem = async (item: ShopItem) => {
		if (player.gold < item.price) {
			setMessage("おかねが たりない！");
			return;
		}

		const newGold = player.gold - item.price;

		setCharacter({
			...player,
			gold: newGold,
		});

		await supabase
			.from("players")
			.update({ gold: newGold })
			.eq("id", player.id);

		const { data: existing } = await supabase
			.from("player_items")
			.select("*")
			.eq("player_id", player.id)
			.eq("item_id", item.id)
			.maybeSingle();

		if (!existing) {
			await supabase
				.from("player_items")
				.insert({ player_id: player.id, item_id: item.id, quantity: 1 });
		} else {
			await supabase
				.from("player_items")
				.update({ quantity: existing.quantity + 1 })
				.eq("id", existing.id);
		}

		setMessage(`${item.name} を １つ てにいれた！`);
	};

	return (
		<div className="max-w-2xl mx-auto p-4">
			<RPGWindow title="どうぐ屋">
				<ul className="space-y-3 text-cyan-200">
					{items.map((item) => (
						<li key={item.id} className="flex justify-between">
							<div>
								<strong>{item.name}</strong>
								<p className="text-xs">{item.description}</p>
							</div>
							<RPGButton onClick={() => buyItem(item)}>
								💰 {item.price}G で買う
							</RPGButton>
						</li>
					))}
				</ul>
			</RPGWindow>
		</div>
	);
}
