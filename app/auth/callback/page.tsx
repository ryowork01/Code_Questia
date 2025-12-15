"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
	const router = useRouter();

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) {
				router.push("/");
			}
		});
	}, [router]);

	return <p>ログイン処理中...</p>;
}


