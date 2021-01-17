import fs from 'fs'

export interface OpeningData {
  eco: string;
  name: string;
}
const codes = JSON.parse(fs.readFileSync('./codes.json').toString())

export const analyzeGame = (fen: string): OpeningData | null => {
  const opening = codes[fen]
  if (opening) {
    return opening as OpeningData
  }

  return null
}
