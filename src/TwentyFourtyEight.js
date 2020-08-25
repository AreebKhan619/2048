import React, { Component } from "react";
import "./TwentyFourtyEight.css";
import UndoIcon from "./undo.svg"
class TwentyFourtyEight extends Component {
  // the game will be of 4x4
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      // matrix: [],
      matrix: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
      ],
      prev: [],
      score: 0

      // very important below

      // matrix: [
      //   [4, null, 2, null],
      //   [4, 128, null, null],
      //   [null, 512, 2, null],
      //   [4, null, 2, null]
      // ]
    };
  }

  componentDidMount() {
    // this.myRef.current.focus();
    this.startOver()
  }

  startOver = () => {
    let m = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];
    this.insertNew(m, true);
    this.insertNew(m, true);
    this.setState({
      matrix: m,
      prev: m,
      score: 0,
      optedForRestart: false
    });
    this.myRef.current.focus();
  }

  move = (m, el, dir) => {
    let r = el.rIndex;
    let c = el.cIndex;
    // let v = el.value;

    if (dir === "up" && r !== 0) {
      //shift logic
      while (r !== 0 && !m[r - 1][c]) {
        m[r - 1][c] = m[r][c];
        m[r][c] = null;
        // if (r - 1 > 0) {
        r = r - 1;
        // } else {
        // break;
        // }
      }
    }

    if (dir === "down" && r !== 3) {
      while (r !== 3 && !m[r + 1][c]) {
        m[r + 1][c] = m[r][c];
        m[r][c] = null;
        r = r + 1;
      }
    }

    // c = 3;

    if (dir === "right" && c !== 3) {
      while (c !== 3 && !m[r][c + 1]) {
        m[r][c + 1] = m[r][c];
        m[r][c] = null;
        c = c + 1;
      }
    }

    if (dir === "left") {
      while (c !== 0 && !m[r][c - 1]) {
        m[r][c - 1] = m[r][c];
        m[r][c] = null;
        c = c - 1;
      }
    }
  };

  merge = (mat, ind, dir) => {
    let m = mat.slice();
    let arrIndices = [];
    let t = [];
    let score = this.state.score

    if (dir === "up" || dir === "down") {
      ind.map((currEl, i) => {
        if (!arrIndices.includes(i)) {
          t = ind.filter((x, j) => {
            if (currEl.cIndex === x.cIndex) {
              arrIndices.push(j);
              return currEl.cIndex === x.cIndex;
            }
          });

          if (dir === "up") {
            let index = 0;
            let lastIndex;
            t.map((currEl, i) => {
              let next = t[i + 1];
              if (i !== lastIndex) {
                if (next) {
                  if (currEl.value === next.value) {
                    m[index][currEl.cIndex] = 2 * currEl.value;
                    m[currEl.rIndex][currEl.cIndex] = 2 * currEl.value; // might seem repetitive, but is needed
                    score = score + 2*currEl.value
                    m[next.rIndex][next.cIndex] = null;
                    m[index + 1][currEl.cIndex] = null; // might seem repetitive, but is needed
                    index = index + 1;
                    lastIndex = i + 1;
                  } else {
                    m[index + 1][currEl.cIndex] = null;
                    m[currEl.rIndex][currEl.cIndex] = null;
                    m[index][currEl.cIndex] = currEl.value;
                    index = index + 1;
                  }
                } else {
                  m[currEl.rIndex][currEl.cIndex] = null;
                  m[index][currEl.cIndex] = currEl.value;

                  if (m[index + 1]) {
                    m[index + 1][currEl.cIndex] = null;
                  }

                  index = index + 1;
                  lastIndex = null;
                }
              }
            });
          } else if (dir === "down") {
            let index = 3; //max-rows
            let lastIndex;

            t.map((currEl, i) => {
              let next = t[i + 1];
              if (next) {
                if (i !== lastIndex) {
                  if (currEl.value === next.value) {
                    m[index][currEl.cIndex] = 2 * currEl.value;
                    score = score + 2*currEl.value
                    m[next.rIndex][next.cIndex] = null;
                    m[index - 1][currEl.cIndex] = null;
                    index = index - 1;
                    lastIndex = i + 1;
                  } else {
                    m[index][currEl.cIndex] = currEl.value;

                    m[index - 1][currEl.cIndex] = null;
                    index = index - 1;
                  }
                }
              } else {
                if (i !== lastIndex) {
                  m[currEl.rIndex][currEl.cIndex] = null;
                  m[index][currEl.cIndex] = currEl.value;
                  if (m[index - 1]) {
                    m[index - 1][currEl.cIndex] = null;
                  }

                  index = index - 1;
                }
              }
            });
          }
        }
      });
    } else if (dir === "right" || dir === "left") {
      if (dir === "right") {
        for (let i = 0; i < m.length; i++) {
          for (let j = m[i].length - 1; j >= 0; j--) {
            if (j !== 0 && m[i][j]) {
              if (m[i][j] === m[i][j - 1]) {
                m[i][j] = 2 * m[i][j];
                score = score + 2*m[i][j]
                m[i][j - 1] = null;
              }
            }
          }
        }

        for (let i = 0; i < m.length; i++) {
          for (let j = m[i].length - 1; j >= 0; j--) {
            if (j !== 0) {
              if (!m[i][j] && m[i][j - 1]) {
                m[i][j] = m[i][j - 1];
                m[i][j - 1] = null;
              }
            }
          }
        }

        // this.setState({
        //   matrix: m
        // });
      } else {
        for (let i = 0; i < m.length; i++) {
          for (let j = 0; j <= m[i].length - 1; j++) {
            if (j !== m[i].length && m[i][j]) {
              if (m[i][j] === m[i][j + 1]) {
                m[i][j] = 2 * m[i][j];
                score = score + 2*m[i][j]
                m[i][j + 1] = null;
              }
            }
          }
        }

        for (let i = 0; i < m.length; i++) {
          for (let j = 0; j <= m[i].length - 1; j++) {
            if (j !== m[i].length - 1) {
              if (!m[i][j] && m[i][j + 1]) {
                m[i][j] = m[i][j + 1];
                m[i][j + 1] = null;
              }
            }
          }
        }

        // this.setState({
        //   matrix: m
        // });
      }
    }

    return score
  };

  random = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  containsNull = array => {
    let arr = array.map(subArray => {
      let res;
      res = subArray.some(value => {
        return !value;
      });
      return res;
    });
    if (arr.includes(true)) {
      return true;
    } else {
      return false;
    }
  };

  // deepCompare = (m) => {

  // }

  insertNew = (m, init = false) => {
    let flag = init
      ? true
      : JSON.stringify(m) !== JSON.stringify(this.state.matrix);
    if (flag) {
      if (this.containsNull(m)) {
        let value = Math.random() < 0.9 ? 2 : 4;

        let rowIndex = this.random(0, 3);
        let colIndex = this.random(0, 3);
        while (m[rowIndex][colIndex]) {
          rowIndex = this.random(0, 3);
          colIndex = this.random(0, 3);
        }

        m[rowIndex][colIndex] = value;
      }
    }
  };

  undoAction = () => {
    this.setState({
      matrix: this.state.prev
    });
    this.myRef.current.focus();
  };

 

  handleKeyDown = async e => {
    const { key } = e;
    let score
    if (
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "ArrowUp" ||
      key === "ArrowDown"
    ) {
      let ind = [];
      // let score = this.state.score

      const clone = items =>
        items.map(item => (Array.isArray(item) ? clone(item) : item));

      let m = clone(this.state.matrix);

      m.map((row, i) => {
        row.map((element, j) => {
          if (element !== null) {
            ind.push({ rIndex: i, cIndex: j, value: element });
          }
        });
      });

      let hasMatrixChanged;

      if (key === "ArrowLeft") {
        ind.map(s => {
          this.move(m, s, "left");
        });

        score = this.merge(m, ind, "left");

        hasMatrixChanged =
          JSON.stringify(m) !== JSON.stringify(this.state.matrix);

        if (hasMatrixChanged) {
          this.insertNew(m);
        }
      } else if (key === "ArrowUp") {
        ind.map(s => {
          this.move(m, s, "up");
        });

        score = this.merge(m, ind, "up");
        hasMatrixChanged =
          JSON.stringify(m) !== JSON.stringify(this.state.matrix);

        if (hasMatrixChanged) {
          this.insertNew(m);
        }

      } else if (key === "ArrowRight") {
        let colSorted = ind.slice().sort((a, b) => {
          if (a.cIndex > b.cIndex) {
            return -1;
          } else if (a.cIndex < b.cIndex) {
            return 1;
          }
        });

        colSorted.map(s => {
          this.move(m, s, "right");
        });

        score = this.merge(m, colSorted, "right");

        hasMatrixChanged =
        JSON.stringify(m) !== JSON.stringify(this.state.matrix);

      if (hasMatrixChanged) {
        this.insertNew(m);
      }

      } else if (key === "ArrowDown") {
        ind
          .slice()
          .reverse()
          .map(s => {
            this.move(m, s, "down");
          });

        score = this.merge(m, ind.slice().reverse(), "down");

        hasMatrixChanged =
          JSON.stringify(m) !== JSON.stringify(this.state.matrix);

        if (hasMatrixChanged) {
          this.insertNew(m);
        }

      }

      if(hasMatrixChanged){
        this.setState({
          prev: this.state.matrix,
          matrix: m,
          score
        });
      }
    }
  };

  render() {
    return (
      <>
      <div
      className="parent-container"
      onFocus={()=>this.myRef.current.focus()}
        // style={{
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center"
        //   // flexDirection: "column"
        // }}
      >

        <div className="btn-group">
        <button onClick={this.undoAction} className="game-btn undo-btn" title="Undo last move" />
        <button onClick={()=>this.setState({optedForRestart: true})} className="game-btn refresh-btn" title="Reset the game"/>
        </div>

        <div
          ref={this.myRef}
          onBlur={()=>this.setState({focus: false})}
          onFocus={()=>this.setState({focus: true})}
          className="outer-box"
          onKeyDown={e => this.handleKeyDown(e)}
          tabIndex="0"
        >
          {this.state.isGameWon && <div className="game-won">Game Won!</div>}

          {this.state.isGameOver && <div className="game-won">Game Over!</div>}

          {this.state.optedForRestart && 
          <div className="game-won" style={{flexDirection: 'column'}}>
            Restart?
            <div style={{display: 'flex', fontSize: '50px', width: 'inherit', justifyContent: 'space-around'}}>
              <div className="game-reset option" onClick={this.startOver}>Yes</div>
              <div className="game-reset option" onClick={()=>this.setState({optedForRestart: false})}>No</div>
            </div>
            </div>
          }


          {this.state.matrix.map((row, i) =>
            row.map((element, j) => (
              <div
                key={i + "-" + j}
                className={`block ` + (element !== null ? `exists` : ``)}
              >
                <div
                  className={
                    `inner _` +
                    (this.state.matrix[i][j] !== null
                      ? this.state.matrix[i][j]
                      : ``)
                  }
                >
                  {this.state.matrix[i][j]}
                </div>
              </div>
            ))
          )}
        </div>

        <div
        className="score-container"
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "grey",
            margin: "10px",
            color: "white",
            borderRadius: "5px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ textAlign: "center", padding: "20px 5px" }}>
            SCORE
            <h3 style={{ margin: 0 }}>{this.state.score}</h3>
          </div>
          {/* <button onClick={this.undoAction}>Undo</button> */}
          {/* <button
            onClick={() => {
              this.setState({
                isGameWon: true
              });
            }}
          >
            Win Game
          </button> */}
        </div>
      </div>
          {!this.state.focus && (
            <p style={{textAlign: 'center'}}>Tap on any block to continue playing</p>
          )}
          </>
    );
  }
}
export default TwentyFourtyEight;
