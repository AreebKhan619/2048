import React, { Component } from "react";
import "./TwentyFourtyEight.css";
class TwentyFourtyEight extends Component {
  // the game will be of 4x4
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      matrix: [
        [null, null, null,null],
        [null, null, null,null],
        [null, null, null,null],
        [null, null, null,null]
      ],
      lastMove: [
        [null, null, null,null],
        [null, null, null,null],
        [null, null, null,null],
        [null, null, null,null]
      ]

      // matrix: [
      //   [2, 4, null, null],
      //   [null, null, null, null],
      //   [null, 512, 2048, null],
      //   [4, 128, null, null],
      // ],

      // very important below

      // matrix: [
      //   [4, null, 2, null],
      //   [4, 128, null, null],
      //   [null, 512, 2, null],
      //   [4, null, 2, null]
      // ]

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

  componentDidUpdate(old,niu){
    console.log(old, niu)
  }

  componentDidMount() {
    this.myRef.current.focus();
    let m = this.state.matrix.slice()
    this.insertNew(m)
    this.insertNew(m)
    this.setState({
      matrix: m,
      lastMove: m.slice()
    })
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
                  m[currEl.rIndex][currEl.cIndex] = null;
                  m[index][currEl.cIndex] = currEl.value;

                  if(m[index+1]){
                    m[index+1][currEl.cIndex] = null;
                  }

                  index = index + 1;
                  lastIndex = null
                }
              }
            });

            this.setState({
              matrix: m
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
                  if(m[index-1]){
                    m[index-1][currEl.cIndex] = null;
                  }

                  index = index - 1;
                }
              }
            });

            // this.setState({
            //   matrix: m
            // });
          }
        }
        return null
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

  random = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  // someFunction = (subArray) => {
  //   let res
  //   res = subArray.some((value)=>{
  //     return !value
  //   })
  //   return res
  //  }
   
   containsNull = (array) => {
     let arr = array.map((subArray)=>{
      let res
      res = subArray.some((value)=>{
        return !value
      })
      return res
     })
     if(arr.includes(true)){
       return true
     }
     else{
       return false
     }
   }

  
  

  insertNew = (m) => {


    if(this.containsNull(m)){
      let value = Math.random() < 0.9 ? 2 : 4;

      let rowIndex = this.random(0,3)
      let colIndex = this.random(0,3)
      while(m[rowIndex][colIndex]){
        rowIndex = this.random(0,3)
        colIndex = this.random(0,3)
      }
  
      m[rowIndex][colIndex]=value
      
    }
 
  }


  undoAction = () => {
    this.setState({
      matrix: this.state.lastMove
    })
  }

  handleKeyDown = e => {
    const { key } = e;

    let ind = [];
    this.state.matrix.map((row, i) => {
      row.map((element, j) => {
        if (element !== null) {
          ind.push({ rIndex: i, cIndex: j, value: element });
        }
        return null
      });
      return null
    });


    let m = this.state.matrix.slice();
    let lastMove =  this.state.matrix.slice()

    if (key === "ArrowLeft") {
      ind.map(s => {
        this.move(m, s, "left");
      });

      this.merge(m, ind, "left");

      this.insertNew(m)

      this.setState({
        lastMove,
        matrix: m
      });
    }
    if (key === "ArrowUp") {

      ind.map(s => {
        this.move(m, s, "up");
      });

      this.merge(m, ind, "up");

      this.insertNew(m)


      this.setState({
        lastMove,
        matrix: m
      });
    }
    if (key === "ArrowRight") {

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

      this.merge(m, colSorted, "right");

      // this.merge(m, ind, "right");

      this.insertNew(m)


      this.setState({
        lastMove,
        matrix: m
      });
    }
    if (key === "ArrowDown") {

      ind
        .slice()
        .reverse()
        .map(s => {
          this.move(m, s, "down");
        });

      this.merge(m, ind.slice().reverse(), "down");

      this.insertNew(m)


      this.setState({
        lastMove,
        matrix: m
      });
    }
  };

  render() {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', flexDirection: 'column' }}>
        <div
          ref={this.myRef}
          className="outer-box"
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
        >

       {this.state.isGameWon && (
          <div className="game-won">
          Game Won!
        </div>
       )}

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
     
        <button onClick={this.undoAction}>Undo</button>
        <button onClick={()=>{this.setState({
          isGameWon: true
        })}}>Win Game</button>

      </div>
    );
  }
}
export default TwentyFourtyEight;
