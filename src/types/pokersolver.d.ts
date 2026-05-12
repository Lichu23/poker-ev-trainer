declare module 'pokersolver' {
  export class Hand {
    name: string
    rank: number
    cards: string[]
    static solve(cards: string[]): Hand
    static winners(hands: Hand[]): Hand[]
  }
}
