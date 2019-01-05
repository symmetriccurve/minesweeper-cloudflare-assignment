import Layout from '../components/layout';
// import boardState from './boardState.json'
import boardState from './boardState2D.json'
// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';

const cellStates = ['BOMB','NUMBER','BLANK']

function fillCell(){
  const randomCellState = Math.floor(Math.random() * 3)
  return cellStates[randomCellState]
}

// function generateBoard(size){
//   console.log("GENERATING BOARD")
//   const rows = size
//   const cols = size
//   let boardStates = []
//   let row = []
//   for(let i=0;i<rows;i++){
//       boardStates.push({
//         i: i,
//         cellHas: cellStates[Math.floor(Math.random() * 3)],
//         shown: false
//       })
//   }
//   return boardStates
// }

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
    <Desk boardSize={10}>
      {
        boardState.map(cell => {
          console.log(`Cell has ${cell.cellHas} rendering ${cell.i} `)
          console.log(`cell.cellHas === 'BLANK'`)
          console.log(`cell.cellhas === 'BOMB'`)
          return(
            <Square key={cell.i} disabled={cell.cellHas == 'BLANK' || cell.cellhas == 'BOMB'|| cell.cellhas == 'NUMBER'}>
              {cell.cellHas === 'BOMB' && <Mine />}
              {cell.cellHas === 'NUMBER' && cell.i }
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