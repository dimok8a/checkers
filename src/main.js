const fieldElement = document.querySelector('.field');
const whatTurnComponent = document.querySelector('.what_turn');

const game = new Game(fieldElement, whatTurnComponent);

game.start();
