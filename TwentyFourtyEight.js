import React, { Component, createRef } from "react";
import "./TwentyFourtyEight.css";
class TwentyFourtyEight extends Component {
  // the game will be of 4x4
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      // matrix: [
      //   [2, 4, 512, null],
      //   [2, 512, 2048, null],
      //   [4, 128, 4, null],
      //   [2, 4, 2, null]
      // ]

      // matrix: [
      //   [2, 4, null, null],
      //   [null, null, null, null],
      //   [null, 512, 2048, null],
      //   [4, 128, null, null],
      // ],

      // very important below

      matrix: [
        [4, null, 2, null],
        [4, 128, null, null],
        [null, 512, 2, null],
        [4, null, 2, null]
      ]

      // matrix: [
      //   [4, null, 2, null],
      //   [4, 128, null, null],
      //   [null, 512, 2, null],
      //   [2, 2, 4, 4]
      // ]

      // matrix: [
      //   [4, null, 2, null],
      //   [null, 128, null, 64],
      //   [null, 512, null, null],
      //   [2, 2, 4, 2]
      // ]
    };
  }

  componentDidMount() {
    this.myRef.current.focus();
  }

  move = (m, el, dir) => {
    let r = el.rIndex;
    let c = el.cIndex;
    let v = el.value;

    // console.log(r,c,v)

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
    console.log(ind);

    let m = mat.slice();
    let arrIndices = [];
    let t = [];

    if (dir === "up" || dir === "down") {
      ind.map((currEl, i) => {
        // console.log(currEl)
        // console.log("having cIndex",currEl)
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
            console.log(t)
            t.map((currEl, i) => {
              let next = t[i + 1];
              if (i !== lastIndex) {
                if (next) {
                    if (currEl.value === next.value) {
                      m[index][currEl.cIndex] = 2 * currEl.value;
                      m[currEl.rIndex][currEl.cIndex] = 2 * currEl.value; // might seem repetitive, but is needed
                      m[next.rIndex][next.cIndex] = null;
                      m[index + 1][currEl.cIndex] = null; // might seem repetitive, but is needed
                      index = index + 1;
                      lastIndex = i + 1;
                    } else {
                      m[index + 1][currEl.cIndex] = null;
                      m[currEl.rIndex][currEl.cIndex]=null
                      m[index][currEl.cIndex] = currEl.value;
                      index = index + 1;
                    }
                } else {
                  // console.log("INDEX VALUE VALLED",index,"CORRESPONDING VALUE", m[currEl.rIndex][currEl.cIndex])
                  m[currEl.rIndex][currEl.cIndex] = null;
                  m[index][currEl.cIndex] = currEl.value;
                  m[index+1][currEl.cIndex] = null;

                  index = index + 1;
                  lastIndex = null
                }
              }
            });

            this.setState({
              matrix: m
            });
          } else if (dir === "down") {
            console.log("down");
            let index = 3; //max-rows
            let lastIndex;

            t.map((currEl, i) => {
              let next = t[i + 1];
              if (next) {
                console.log(next);
                if (i !== lastIndex) {
                  if (currEl.value === next.value) {
                    // console.log(currEl.value, next.value)
                    console.log(index, currEl.cIndex);
                    m[index][currEl.cIndex] = 2 * currEl.value;
                    m[next.rIndex][next.cIndex] = null;
                    m[index - 1][currEl.cIndex] = null;
                    index = index - 1;
                    lastIndex = i + 1;
                  } else {
                    m[index][currEl.cIndex] = currEl.value;

                    m[index - 1][currEl.cIndex] = null;
                    // m[currEl.rIndex][currEl.cIndex]=null
                    index = index - 1;
                  }
                }
              } else {
                if (i !== lastIndex) {
                  m[currEl.rIndex][currEl.cIndex] = null;
                  m[index][currEl.cIndex] = currEl.value;
                  m[index-1][currEl.cIndex] = null;

                  index = index - 1;
                }
              }
              console.log(lastIndex);
            });

            // this.setState({
            //   matrix: m
            // });
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

        this.setState({
          matrix: m
        });
      } else {
        for (let i = 0; i < m.length; i++) {
          for (let j = 0; j <= m[i].length - 1; j++) {
            if (j !== m[i].length && m[i][j]) {
              if (m[i][j] === m[i][j + 1]) {
                m[i][j] = 2 * m[i][j];
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

        this.setState({
          matrix: m
        });
      }
    }
  };

  handleKeyDown = e => {
    const { key } = e;

    let ind = [];
    this.state.matrix.map((row, i) => {
      row.map((element, j) => {
        if (element !== null) {
          ind.push({ rIndex: i, cIndex: j, value: element });
        }
      });
    });

    // console.log(ind);

    let m = this.state.matrix.slice();

    if (key === "ArrowLeft") {
      console.log("Left has been pressed");
      ind.map(s => {
        this.move(m, s, "left");
      });

      this.merge(m, ind, "left");

      this.setState({
        matrix: m
      });
    }
    if (key === "ArrowUp") {
      // console.log("Up has been pressed");

      ind.map(s => {
        this.move(m, s, "up");
      });

      this.merge(m, ind, "up");

      this.setState({
        matrix: m
      });
    }
    if (key === "ArrowRight") {
      console.log("Right has been pressed");

      console.log(ind);

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

      // console.log(colSorted);
      // console.log(colSorted);
      this.merge(m, colSorted, "right");

      // this.merge(m, ind, "right");

      this.setState({
        matrix: m
      });
    }
    if (key === "ArrowDown") {
      console.log("Down has been pressed");

      // this.move(m, ind[2], "down");

      ind
        .slice()
        .reverse()
        .map(s => {
          this.move(m, s, "down");
        });

      this.merge(m, ind.slice().reverse(), "down");

      this.setState({
        matrix: m
      });
    }
  };

  render() {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          ref={this.myRef}
          className="outer-box"
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
        >
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
      </div>
    );
  }
}
export default TwentyFourtyEight;
