"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RPGWindow, RPGButton } from "@/components/rpg-window";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [msg, setMsg] = useState("");

	const upgrade = async () => {
		const { error } = await supabase.auth.updateUser({
			email,
			password,
		});

		if (error) {
			setMsg("アップグレード失敗：" + error.message);
			return;
		}

		setMsg("アカウントをアップグレードしました！");
		router.push("/home");
	};

	return (
		<div className="max-w-sm mx-auto mt-16">
			<RPGWindow title="アカウント登録（引き継ぎ）">
				<div className="flex flex-col space-y-4">
					<input
						className="rpg-input"
						placeholder="メールアドレス"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						className="rpg-input"
						type="password"
						placeholder="パスワード"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<RPGButton className="rpg-menu-item" onClick={upgrade}>アカウントに変換する</RPGButton>

					<RPGButton className="rpg-menu-item" onClick={() => router.push("/home")}>ホームに戻る</RPGButton>

					{msg && <p>{msg}</p>}
				</div>
			</RPGWindow>
		</div>
	);
}
