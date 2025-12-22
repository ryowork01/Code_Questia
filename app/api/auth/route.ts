// app/api/user/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

// ユーザー情報の取得
export async function GET(request: NextRequest) {
	const supabase = await createServerSupabaseClient();

	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json(null);
		}

		const { data: profile, error: profileError } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", session.user.id)
			.single();

		if (profileError) {
			throw profileError;
		}

		return NextResponse.json({
			user: session.user,
			profile,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "ユーザー情報の取得に失敗しました" },
			{ status: 500 }
		);
	}
}

// プロフィール更新
export async function PUT(request: NextRequest) {
	const supabase = await createServerSupabaseClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return NextResponse.json(
			{ error: "認証が必要です" },
			{ status: 401 }
		);
	}

	try {
		const { name } = await request.json();

		if (!name) {
			return NextResponse.json(
				{ error: "名前は必須です" },
				{ status: 400 }
			);
		}

		const { data, error: updateError } = await supabase
			.from("profiles")
			.update({ name })
			.eq("id", session.user.id)
			.select();

		if (updateError) {
			throw updateError;
		}

		return NextResponse.json(data[0]);
	} catch (error) {
		return NextResponse.json(
			{ error: "プロフィールの更新に失敗しました" },
			{ status: 500 }
		);
	}
}
