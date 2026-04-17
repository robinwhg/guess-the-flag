export interface ScoreRecord {
  id: string
  createdAt: string
  regionSlug: string
  regionTitle: string
  gameSlug: string
  gameTitle: string
  gameMode: GameMode
  totalQuestions: number
  totalCorrectQuestions: number
  elapsedSeconds: number
}

const SCORE_STORAGE_KEY = 'globe-rush:scores:v1'
const MAX_SCORES_PER_GAME = 16

export function useScoreHistory() {
  const scores = useLocalStorage<ScoreRecord[]>(SCORE_STORAGE_KEY, [])

  function saveScore(score: ScoreRecord) {
    const nextScores = [score, ...(scores.value ?? [])]
    const gameScoreCounts = new Map<string, number>()

    scores.value = nextScores.filter((entry) => {
      const key = `${entry.regionSlug}:${entry.gameSlug}`
      const existingCount = gameScoreCounts.get(key) ?? 0

      if (existingCount >= MAX_SCORES_PER_GAME)
        return false

      gameScoreCounts.set(key, existingCount + 1)
      return true
    })
  }

  function getScores() {
    return scores.value ?? []
  }

  function getScoresForGame(regionSlug: string, gameSlug: string, gameMode: GameMode) {
    return getScores().filter(score => score.regionSlug === regionSlug && score.gameSlug === gameSlug && score.gameMode === gameMode)
  }

  return {
    scores,
    saveScore,
    getScores,
    getScoresForGame,
  }
}
