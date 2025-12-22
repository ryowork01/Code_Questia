"use client"

import { set } from "date-fns"
import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Character {
  id: string
  name: string
  level: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  exp: number
  nextLevelExp: number
  gold: number
  skills: Skill[]
}

export interface Skill {
  id: string
  name: string
  description: string
  mpCost: number
}

export interface GameState {
  character: Character
  currentPage: "home" | "learn" | "battle" | "status" | "skillboard"
  message: string
  isAnimating: boolean
}

interface GameContextType {
  gameState: GameState
  setCharacter: (character: Character) => void
  setPage: (page: GameState["currentPage"]) => void
  setMessage: (message: string) => void
  gainExp: (amount: number) => void
  learnSkill: (skill: Skill) => void
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  gainGold: (amount: number) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const defaultCharacter: Character = {
  id: "1",
  name: "勇者",
  level: 1,
  hp: 30,
  maxHp: 30,
  mp: 10,
  maxMp: 10,
  exp: 0,
  nextLevelExp: 100,
  
  gold: 0,  // 初期所持金

  skills: [
    {
      id: "slash",
      name: "なぎはらい",
      description: "通常攻撃",
      mpCost: 0,
    },
  ],
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    character: defaultCharacter,
    currentPage: "home",
    message: "ようこそ、勇者よ！",
    isAnimating: false,
  })

  const setCharacter = useCallback((character: Character) => {
    setGameState((prev) => ({ ...prev, character }))
  }, [])

  const setPage = useCallback((page: GameState["currentPage"]) => {
    setGameState((prev) => ({ ...prev, currentPage: page }))
  }, [])

  const setMessage = useCallback((message: string) => {
    setGameState((prev) => ({ ...prev, message }))
  }, [])

  const gainExp = useCallback((amount: number) => {
    setGameState((prev) => {
      const newExp = prev.character.exp + amount
      if (newExp >= prev.character.nextLevelExp) {
        return {
          ...prev,
          character: {
            ...prev.character,
            level: prev.character.level + 1,
            exp: 0,
            nextLevelExp: Math.floor(prev.character.nextLevelExp * 1.5),
            maxHp: prev.character.maxHp + 10,
            hp: prev.character.maxHp + 10,
            maxMp: prev.character.maxMp + 5,
            mp: prev.character.maxMp + 5,
          },
          message: `${prev.character.name}はレベル${prev.character.level + 1}に上がった！`,
        }
      }
      return {
        ...prev,
        character: { ...prev.character, exp: newExp },
      }
    })
  }, [])

  const learnSkill = useCallback((skill: Skill) => {
    setGameState((prev) => {
      const hasSkill = prev.character.skills.some((s) => s.id === skill.id)
      if (hasSkill) return prev

      return {
        ...prev,
        character: {
          ...prev.character,
          skills: [...prev.character.skills, skill],
        },
        message: `${skill.name}を習得した！`,
      }
    })
  }, [])

  const takeDamage = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      character: {
        ...prev.character,
        hp: Math.max(0, prev.character.hp - amount),
      },
    }))
  }, [])

  const heal = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      character: {
        ...prev.character,
        hp: Math.min(prev.character.maxHp, prev.character.hp + amount),
      },
    }))
  }, [])
  
  
  // 追加: 金を増やす関数
  const gainGold = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      character: {
        ...prev.character,
        gold: prev.character.gold + amount,
      },
    }))
  }, []) 

  const value: GameContextType = {
    gameState,
    setCharacter,
    setPage,
    setMessage,
    gainExp,
    learnSkill,
    takeDamage,
    heal,
    gainGold,  // 追加: gainGold をコンテキストに含める
  }



  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within GameProvider")
  }
  return context
}
