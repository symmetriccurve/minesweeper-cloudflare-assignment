import Layout from '../components/layout';
import boardState from './boardState.json'
// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';

const cellStates = ['BOMB','NUMBER','BLANK']
const boardSize = 9
function fillCell(){
  const randomCellState = Math.floor(Math.random() * 3)
  return cellStates[randomCellState]
}

function generateBoard(size){
  const rows = size
  const cols = size
  let boardStates = []
  let row = []
  for(let i=0;i<rows;i++){
      boardStates.push({
        i: i,
        cellHas: cellStates[Math.floor(Math.random() * 3)],
        shown: false
      })
  }
  return boardStates
}

// function generateBoard(size){
//   const rows = size
//   const cols = size
//   let boardState = []
//   let row = []
//   for(let i=0;i<rows;i++){
//     for(let j=0;j<cols;j++){
//       row.push({
//         i: i,
//         j: j,
//         cellHas: fillCell(),
//         shown: false
//       })
//     }
//     boardState.push(row)
//     row = []
//   }
//   return boardState
// }
function findBomb(cellIndex){
  console.log(cellIndex)
  let bombs = 0
  let cellsToCheck = []
  if(cellIndex%boardSize == boardSize - 1){
    /* Right Edge */
    cellsToCheck = [cellIndex - (boardSize + 1),cellIndex- boardSize,cellIndex - 1,cellIndex +(boardSize- 1),cellIndex + boardSize]
  }else if(cellIndex%boardSize == 0){
    /* Left Edge */
    cellsToCheck = [cellIndex- boardSize,cellIndex-(boardSize - 1),cellIndex + 1,cellIndex + boardSize,cellIndex + (boardSize  + 1)]
  }else if(cellIndex < boardSize){
    /* Top Edge */
    cellsToCheck = [cellIndex - 1,cellIndex +(boardSize- 1),cellIndex + boardSize,cellIndex + (boardSize  + 1),cellIndex + 1] 
  }else if(cellIndex > (boardSize*boardSize) - boardSize && cellIndex < (boardSize*boardSize) - 1){
    /* Bottom Edge */
    console.log('Bttom Edge');
    cellsToCheck = [cellIndex - 1,cellIndex - (boardSize + 1),cellIndex- boardSize,cellIndex-(boardSize - 1),cellIndex + 1]
  }

  cellsToCheck.forEach(cellIndex=>{
    console.log(`CHECKING CELL----------------- ${cellIndex}`);
    if(boardState[cellIndex].cellHas == 'BOMB'){
      console.log(`Bomb Found at ${cellIndex}`);
      bombs++
    }
  })

  console.log(`BOMBS FOUND, ${bombs}`);
  // for(let i = cellIndex - (boardSize+1); i <= cellIndex - (boardSize-1);i++){
  //   console.log(`CHECKING CELL----------------- ${i}`);
  //   if(cellIndex%boardSize != boardSize - 1){
  //     if(boardState[i].cellHas == 'BOMB'){
  //       console.log(`Bomb Found at ${i}`);
  //       bombs++
  //     }
  //   }else{
  //     console.log(`CLICKED ON EDGE CELL`);
  //   }
  // }
  // for(let i = cellIndex -1; i <= cellIndex +1; i++){
  //   console.log(`CHECKING CELL----------------- ${i}`);
  //   if(boardState[i].cellHas == 'BOMB' && i != cellIndex){
  //     console.log(`Bomb Found at ${i}`);
  //     bombs++
  //   }
  // }
  // for(let i = cellIndex + (boardSize-1); i <= cellIndex + (boardSize+1);i++){
  //   console.log(`CHECKING CELL----------------- ${i}`);
  //   if(boardState[i].cellHas == 'BOMB'){
  //     console.log(`Bomb Found at ${i}`);
  //     bombs++
  //   }
  // }
  // console.log(`BOMBS FOUND, ${bombs}`);
}

const Index = () => {
//   const boardState = []
//   for(let i=0;i<100;i++){
//     boardState.push({
//       i: i,
//       cellHas: cellStates[Math.floor(Math.random() * 3)],
//       shown: false
//     })
// }
  return(
    <Layout title={`Minesweeper (active)`}>
    <Desk boardSize={boardSize}>
      {
        boardState.slice(0,(boardSize*boardSize)-100).map(cell => {
          // console.log(`Cell has ${cell.cellHas} rendering ${cell.i} `)
          // console.log(`cell.cellHas === 'BLANK'`)
          // console.log(`cell.cellhas === 'BOMB'`)
          return(
            <Square key={cell.i} disabled={cell.cellHas == 'BLANK' || cell.cellhas == 'BOMB'|| cell.cellhas == 'NUMBER'} onClick={()=>findBomb(cell.i)}>
              {cell.cellHas === 'BOMB' && <Mine /> }
              {cell.cellHas === 'NUMBER' && cell.i }
              {cell.cellHas === 'BOMB' && cell.i }
              {/* <Mine /> */}
              {/* {i === 25 && <Flag />}
              {i === 77 ? '20' : ''} */}
            </Square>
          )
      })
    }
    </Desk>
  </Layout>
  )
  }

export default Index;


/* const Index = () => (
  <Layout title={`Minesweeper (active)`}>
    <Desk boardSize={10}>
      {[...Array(100).keys()].map(i => (
        <Square key={i} disabled={i === 55 || i === 10}>
          {i === 10 && <Mine />}
          {i === 25 && <Flag />}
          {i === 77 ? '20' : ''}
        </Square>
      ))}
    </Desk>
  </Layout>
); */