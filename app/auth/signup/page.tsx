"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { RPGWindow, RPGButton } from "@/components/rpg-window";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (!error) {
      setMsg("確認メールを送信しました");
      }

    
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <RPGWindow title="新規登録">
        <div className="flex flex-col space-y-4 text-white">
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

          <RPGButton
            className="rpg-menu-item"
            onClick={handleSignUp}
          >
            アカウント作成
          </RPGButton>

          <RPGButton
            className="rpg-menu-item"
            onClick={() => router.push("/")}
          >
            トップページに戻る
          </RPGButton>

          {msg && <p>{msg}</p>}
        </div>
      </RPGWindow>
    </div>
  );
}



