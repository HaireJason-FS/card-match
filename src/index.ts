// Imports your SCSS stylesheet
import '@/styles/index.scss';

import "./styles/index.scss";
import { Game } from "./game";


import clogo from "./IMG/c-logo.png";
import cpplogo from "./IMG/c++-logo.png";
import cardback from "./IMG/card-flip-card-image.png";
import csharplogo from "./IMG/csharp-logo.png";
import csslogo from "./IMG/css3-logo.png";
import gologo from "./IMG/goMascot-logo.png";
import htmlogo from "./IMG/HTML-logo.png";
import javalogo from "./IMG/java-logo.png";
import jslogo from "./IMG/JavaScript-Logo.png";
import phplogo from "./IMG/php-logo.png";
import pythonlogo from "./IMG/python-logo.png";

const images: string[] = [
  clogo,
  cpplogo,
  csharplogo,
  csslogo,
  gologo,
  htmlogo,
  javalogo,
  jslogo,
  phplogo,
  pythonlogo,
  cardback,
];


const gameBoard = document.getElementById("game-board") as HTMLElement;
const triesDisplay = document.getElementById("tries") as HTMLElement;

function startGame() {
  const selectedDifficulty = (document.querySelector('input[name="difficulty"]:checked') as HTMLInputElement).value;

  let pairs = 3;
  let tries = 3;
  let columns = 3;

  if (selectedDifficulty === "medium") {
    pairs = 6;
    tries = 6;
    columns = 4;   // grid layout 4 × 3
  }

  if (selectedDifficulty === "hard") {
    pairs = 10;
    tries = 9;
    columns = 5;   // grid layout 5 × 4
  }

  const game = new Game(pairs, images, cardback, tries);
  triesDisplay.textContent = `Attempts Left: ${tries}`;
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 120px)`;
  game.render(gameBoard, triesDisplay);
}

// Start once on load
startGame();

// Restart when difficulty is changed
document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
  radio.addEventListener("change", startGame);
});