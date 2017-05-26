import React from 'react';
import Stars from './Stars';
import Answer from './Answer';
import Button from './Button';
import Numbers from './Numbers';
import DoneFrame from './DoneFrame';
import _ from 'lodash';

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

class Game extends React.Component {
  static randomNumber = () => 1 + Math.floor(Math.random()*9);
  static initialState = () => ({
    selectedNumbers: [],
    numberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    usedNumbers: [],
    redraws: 5,
    doneStatus: null
  });
  state = Game.initialState();

  selectNumber = (clickedNumber) => {
    if (_.includes(this.state.selectedNumbers, clickedNumber)) return;
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
      usedNumbers: prevState.usedNumbers.concat(clickedNumber)
    }));
  }
  resetGame = () => {
    this.setState(Game.initialState());
  }
  unselectNumber = (clickedNumber) => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
    }))
  }

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.numberOfStars ===
      prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  }

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect:null,
      numberOfStars: Game.randomNumber(),
    }), this.updateDoneStatus);

  }
  redraw = () => {
    if (this.state.redraws === 0) { return }
    this.setState(prevState => ({
      numberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      redraws: prevState.redraws - 1
    }), this.updateDoneStatus);
  }

  possibleSolutions = ({numberOfStars, usedNumbers}) => {
    const possibleNumbers = _.range(1,9).filter(number =>
      usedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, numberOfStars);
  }
  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { doneStatus: 'Done. Nice!' };
      }
      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: 'Game Over!' };
      }
    });
  }

  render() {
    const { selectedNumbers, numberOfStars, answerIsCorrect, usedNumbers, redraws, doneStatus } = this.state;

    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={numberOfStars} />
          <Button selectedNumbers={selectedNumbers}
            checkAnswer={this.checkAnswer}
            acceptAnswer={this.acceptAnswer}
            answerIsCorrect={answerIsCorrect}
            redraw={this.redraw}
            redraws={redraws} />
          <Answer selectedNumbers={selectedNumbers}
            unselectNumber={this.unselectNumber} />
        </div>
        <br />
        {doneStatus ?
          <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/> :
          <Numbers selectNumber={this.selectNumber} usedNumbers={usedNumbers} selectedNumbers={this.state.selectedNumbers} />
        }
      </div>
    );
  }

}

export default Game;
