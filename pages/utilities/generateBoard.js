const cellStates = ['BOMB','NUMBER','BLANK']

export default function generateBoard(size){
    const cellCount = size * size
    let boardState = []
    for(let i=0;i<cellCount;i++){
        boardState.push({
          id: i,
          holds: cellStates[Math.floor(Math.random() * 3)],
          neighboringBombs: 0,
          isExposed: false,
          isFlagged: false,
        })
    }
    return boardState
  }