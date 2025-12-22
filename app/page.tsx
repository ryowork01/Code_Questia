"use client";

import { useRouter } from "next/navigation";
import { RPGWindow, RPGButton } from "@/components/rpg-window";
import { supabase } from "@/lib/supabaseClient";

export default function TitlePage() {
  const router = useRouter();

  const startAsGuest = async () => {
    const { data,error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error(error);
      return;
    }

    console.log("ゲストでログイン:", data);
    router.push("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-sm w-full p-4">
        {/* タイトルウィンドウ */}
        <RPGWindow className="mb-6">
          <div
            style={{
              fontFamily: '"Courier New", monospace',
              letterSpacing: "0.1em",
              fontWeight: "bold",
            }}
            className="text-center text-yellow-300 text-2xl mb-1"
          >
            ⚔️ 勇者の学習クエスト ⚔️
          </div>

          <div className="text-center text-gray-300 text-xs">
            ～ 冒険の書をつくるか？ ～
          </div>
        </RPGWindow>

        {/* メニュー */}
        <RPGWindow>
          <div className="space-y-3">
            <RPGButton className="rpg-menu-item" onClick={() => router.push("/auth/signup")}>
              🎉 新しく冒険を始める（新規登録）
            </RPGButton>

            <RPGButton className="rpg-menu-item" onClick={() => router.push("/auth/login")}>
              🔐 冒険を再開する（ログイン）
            </RPGButton>

            {/* <RPGButton className="rpg-menu-item" onClick={startAsGuest}>
              👤 ゲストとして冒険を始める
            </RPGButton> */}  {/* ゲストログインは一時的に非表示 */}
          </div>
        </RPGWindow> 
      </div>
    </div>
  );
}
