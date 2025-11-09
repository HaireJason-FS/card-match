import { CardState } from "./enums";

export class Card {
  id: number;
  image: string;
  state: CardState;

  constructor(id: number, image: string) {
    this.id = id;
    this.image = image;
    this.state = CardState.FaceDown;
  }
}
