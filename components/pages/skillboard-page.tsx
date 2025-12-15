"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RPGWindow, RPGButton } from "@/components/rpg-window";
import { useGame } from "@/components/game-state";



//型定義
type Skill = {
	id: string;
	name: string;
	description?: string;
};

type UserSkill = {
	id?: string;
	user_id: string;
	skill_id: string;
	level: number;
	name: string;
	description?: string;
};


export default function SkillBoardPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const router = useRouter();
  const { setPage, setMessage } = useGame();

  useEffect(() => {
	loadSkills();
  }, []);

  const loadSkills = async () => {
	const { data: skills } = await supabase
	  .from("skills")
	  .select("*");
	const { data: userSkills } = await supabase
	  .from("user_skills")
	  .select("*");

setSkills(skills ?? []);
setUserSkills(userSkills ?? []);
  };

const unlock = async (skillId: string) => {
	await supabase.from("user_skills").insert({
		skill_id: skillId,
		level: 1,
	});
	loadSkills();
}




	return (
		<div className="max-w-lg mx-auto mt-10">
			<RPGWindow title="スキルボード(後日実装予定)">
				<div className="grid grid-cols-4 gap-4 p-4">
					{skills.map((s) => {
						const owned = userSkills.find((u) => u.skill_id === s.id);
						const level = owned?.level ?? 0;
						const locked = level === 0;

						return (
							<div
								key={s.id}
								className={`w-16 h-16 border p-2 flex items-center justify-center rounded
				${locked ? "bg-gray-700 text-gray-500" : "bg-yellow-500 text-black"}
				`}
							>
								{locked ? (
									<button onClick={() => unlock(s.id)}>🔒</button>
								) : (
									<span>★{level}</span>
								)}
							</div>
						);
					})}
				</div>

				<RPGButton
					onClick={() => {
						setPage("home");
						setMessage("スキルボードを とじた。");
					}}
					className="dq-button rpg-menu-item mt-4"
				>
					◀ ホームへもどる
				</RPGButton>
			</RPGWindow>	
		</div>

		

	);
}

