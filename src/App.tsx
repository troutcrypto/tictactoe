import * as React from 'react'
import './index.css'

// squares need outer state so squares should live in board
const winningRows = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (let i = 0; i < winningRows.length; i++) {
    let [a, b, c] = winningRows[i];

    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      console.log("We have winner:", squares[a]);
      return squares[a];
    }
  }
  return null;
}
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          clicked: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      clicked: null,
    };
  }

  handleClick(i) {
    // history  starts off with array of nulls
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // set the sqaure
    squares[i] = (this.state.xIsNext ? 'X' : 'O');
    // now update the state 
    this.setState({
      history: history.concat([
        {
          squares: squares,
          clicked: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      clicked: i,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) == 0,
    });
    // notice that we do not update the history
    // history is updated AFTER we have made a move
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        "Go to move # " + move :
        "Reset game";
      return (
        <ul key={move}>
          <button onClick={() => {
            this.jumpTo(move);}}
            >{desc}</button>
        </ul>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === 9){
      status = "Draw"
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => {
              console.log("Want to set the value on click for ", i);
              this.handleClick(i);
              }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/*<ul>{moves}</ul>*/}
          <ul>
            <ul key="0" onClick={() => this.jumpTo(0)}>
              <button>
                Reset game
              </button>
            </ul>
            <ul key="undo" onClick={() => {
              if (this.state.stepNumber === 0) {
                return;
              }
              this.jumpTo(this.state.stepNumber - 1);
              }}
            >
              <button>
                Undo Move 
              </button>
            </ul>
          </ul>
        </div>
      </div>
    );
  }
}

export default function App() {
  //ReactDOM.render(
  return (
    <Game />
  );
}