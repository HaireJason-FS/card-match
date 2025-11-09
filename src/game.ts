import { GameStatus, CardState } from "./enums";
import { Card } from "./card";

export class Game {
  private cards: Card[] = [];
  private flippedCards: Card[] = [];
  private triesLeft: number;
  private gameStatus: GameStatus = GameStatus.Playing;

  constructor(
    private totalPairs: number,
    private allImages: string[],
    private backImage: string,
    tries: number
  ) {
    this.triesLeft = tries;
    this.initializeGame();
  }

  private initializeGame(): void {
    // Shuffle all images and pick only the needed number of unique faces
    const shuffled = this.shuffle([...this.allImages]);
    const selected = shuffled.slice(0, this.totalPairs);

    // Duplicate to create pairs, then shuffle again for board randomness
    const paired = [...selected, ...selected];
    const randomized = this.shuffle(paired);

    this.cards = randomized.map((img, index) => new Card(index, img));
  }

  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public render(board: HTMLElement, triesDisplay: HTMLElement): void {
    board.innerHTML = "";

    this.cards.forEach((card) => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";

      // Only show face if card is face up or matched
      if (card.state === CardState.FaceUp || card.state === CardState.Matched) {
        cardEl.classList.add("flipped");
      }

      const cardInner = document.createElement("div");
      cardInner.className = "card-inner";

      // FRONT (pair image)
      const cardFront = document.createElement("div");
      cardFront.className = "card-front";
      const frontImg = document.createElement("img");
      frontImg.src = card.image;
      cardFront.appendChild(frontImg);

      // BACK (hidden image)
      const cardBack = document.createElement("div");
      cardBack.className = "card-back";
      const backImg = document.createElement("img");
      backImg.src = this.backImage;
      cardBack.appendChild(backImg);

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      cardEl.appendChild(cardInner);

      cardEl.addEventListener("click", () =>
        this.handleCardClick(card, board, triesDisplay)
      );

      board.appendChild(cardEl);
    });
  }
  
  private handleCardClick(card: Card, board: HTMLElement, triesDisplay: HTMLElement): void {
    if (this.gameStatus !== GameStatus.Playing) return;
    if (card.state !== CardState.FaceDown) return;

    // ✅ Allow flipping only 2 cards at a time
    if (this.flippedCards.length === 2) return;

    // Flip the selected card
    card.state = CardState.FaceUp;
    this.flippedCards.push(card);
    this.render(board, triesDisplay);

    // If two cards are now face-up, check match
    if (this.flippedCards.length === 2) {
      setTimeout(() => this.checkMatch(board, triesDisplay), 800);
    }
  }

  private checkMatch(board: HTMLElement, triesDisplay: HTMLElement): void {
    const [card1, card2] = this.flippedCards;

    if (card1.image === card2.image) {
      // ✅ Pair found → lock them as matched
      card1.state = CardState.Matched;
      card2.state = CardState.Matched;
    } else {
      // ✅ Not a match → flip them back down
      card1.state = CardState.FaceDown;
      card2.state = CardState.FaceDown;
      this.triesLeft--;
      triesDisplay.textContent = `Tries Left: ${this.triesLeft}`;
    }

    // Clear tracking buffer
    this.flippedCards = [];
    this.render(board, triesDisplay);

    // Win / Lose checks
    if (this.triesLeft <= 0) {
      this.gameStatus = GameStatus.Lost;
      this.showEndMessage("😢 Game Over!");
    } else if (this.cards.every(c => c.state === CardState.Matched)) {
      this.gameStatus = GameStatus.Won;
      this.showEndMessage("🎉 You Win!");
    }
  }

  private showEndMessage(message: string): void {
  const popup = document.createElement("div");
  popup.className = "popup";

  popup.innerHTML = `
    <div class="popup-content">
      <h2>${message}</h2>
      <button id="play-again">Play Again</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Refresh entire page to re-trigger difficulty selection + tries reset
  document.getElementById("play-again")?.addEventListener("click", () => {
    window.location.reload();
  });
}


  private resetGame(): void {
    this.gameStatus = GameStatus.Playing;
    this.initializeGame();

    const board = document.getElementById("game-board")!;
    const triesDisplay = document.getElementById("tries")!;

    triesDisplay.textContent = `Attempts Left: ${this.triesLeft}`;
    this.render(board, triesDisplay);
  }
}
