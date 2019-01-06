import Layout from '../components/layout';
import boardState from './boardState.json'
// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';

import React, { Component } from 'react'

export default class App extends Component {
  state = {
    boardState: generateBoard(100),
    isExploded: false
  }

  getNeighboringBombCount(boardState,cellId){
    let neighboringBombCount = 0
    let cellIdsToCheckForBomb = []
    let blankCells = []
    if(
        cellId == 0 || 
        cellId == boardSize - 1 || 
        cellId == boardSize*boardSize - boardSize || 
        cellId == boardSize*boardSize - 1
      ){
       /* Corners */
      switch(cellId){
        case 0: 
          /* Top Left */
          cellIdsToCheckForBomb = [1,boardSize,boardSize + 1,]
          break
        case boardSize-1: 
           /* Top Right */
          cellIdsToCheckForBomb = [cellId - 1,cellId +(boardSize - 1),cellId + boardSize] 
          break
        case boardSize*boardSize - boardSize: 
           /* Bottom Left */
         cellIdsToCheckForBomb = [cellId- boardSize,cellId - (boardSize - 1),cellId + 1]  
         break
        case boardSize*boardSize - 1: 
          /* Bottom Right */
          cellIdsToCheckForBomb = [cellId - 1,cellId - (boardSize + 1),cellId- boardSize]
          break
      }
    }else if(cellId%boardSize == boardSize - 1){
      /* Right Edge */
      console.log('CLICK ON RIGHT EDGE');
      cellIdsToCheckForBomb = [
          cellId - (boardSize + 1),
          cellId- boardSize,cellId - 1,
          cellId +(boardSize- 1),
          cellId + boardSize
        ]
    }else if(cellId%boardSize == 0){
      /* Left Edge */
      console.log('CLICK ON Left EDGE');
      cellIdsToCheckForBomb = [cellId- boardSize,cellId-(boardSize - 1),cellId + 1,cellId + boardSize,cellId + (boardSize  + 1)]
    }else if(cellId < boardSize){
      /* Top Edge */
      console.log('CLICK ON Top EDGE');
      cellIdsToCheckForBomb = [cellId - 1,cellId +(boardSize- 1),cellId + boardSize,cellId + (boardSize  + 1),cellId + 1] 
    }else if(cellId > (boardSize*boardSize) - boardSize && cellId < (boardSize*boardSize) - 1){
      /* Bottom Edge */
      console.log('Bottom Edge');
      cellIdsToCheckForBomb = [cellId - 1,cellId - (boardSize + 1),cellId- boardSize,cellId-(boardSize - 1),cellId + 1]
    }else{
      cellIdsToCheckForBomb = [cellId - (boardSize + 1),cellId- boardSize,cellId-(boardSize - 1),cellId - 1,cellId + 1,cellId +(boardSize- 1),cellId + boardSize,cellId + (boardSize  + 1)]  
    }

    cellIdsToCheckForBomb.forEach(cellId=>{
      console.log(`CHECKING CELL----------------- ${cellId}`)
      if(boardState[cellId].holds == 'BOMB'){
        console.log(`Bomb Found at ${cellId}`)
        neighboringBombCount++
      }
    })
    console.log(`FOUND BLANK CELLS AT`, blankCells)
    
    return neighboringBombCount
  }


  enableNeighboringBlankCells(boardState,cellId){
    let blankCells = []
    let cellIdsToCheckForBlank = []
    var blankCellIds = []
    const getAllBlanks = (cellId) => {
      if(
        cellId == 0 || 
        cellId == boardSize - 1 || 
        cellId == boardSize*boardSize - boardSize || 
        cellId == boardSize*boardSize - 1
      ){
       /* Corners */
      switch(cellId){
        case 0: 
          /* Top Left */
          cellIdsToCheckForBlank = [1,boardSize,boardSize + 1,]
          break
        case boardSize-1: 
           /* Top Right */
           cellIdsToCheckForBlank = [cellId - 1,cellId +(boardSize - 1),cellId + boardSize] 
          break
        case boardSize*boardSize - boardSize: 
           /* Bottom Left */
           cellIdsToCheckForBlank = [cellId- boardSize,cellId - (boardSize - 1),cellId + 1]  
         break
        case boardSize*boardSize - 1: 
          /* Bottom Right */
          cellIdsToCheckForBlank = [cellId - 1,cellId - (boardSize + 1),cellId- boardSize]
          break
      }
      }else if(cellId%boardSize == boardSize - 1){
        /* Right Edge */
        console.log('CLICK ON RIGHT EDGE');
        cellIdsToCheckForBlank = [
            cellId - (boardSize + 1),
            cellId- boardSize,cellId - 1,
            cellId +(boardSize- 1),
            cellId + boardSize
          ]
      }else if(cellId%boardSize == 0){
        /* Left Edge */
        console.log('CLICK ON Left EDGE');
        cellIdsToCheckForBlank = [cellId- boardSize,cellId-(boardSize - 1),cellId + 1,cellId + boardSize,cellId + (boardSize  + 1)]
      }else if(cellId < boardSize){
        /* Top Edge */
        console.log('CLICK ON Top EDGE');
        cellIdsToCheckForBlank = [cellId - 1,cellId +(boardSize- 1),cellId + boardSize,cellId + (boardSize  + 1),cellId + 1] 
      }else if(cellId > (boardSize*boardSize) - boardSize && cellId < (boardSize*boardSize) - 1){
        /* Bottom Edge */
        console.log('Bottom Edge');
        cellIdsToCheckForBlank = [cellId - 1,cellId - (boardSize + 1),cellId- boardSize,cellId-(boardSize - 1),cellId + 1]
      }else{
        cellIdsToCheckForBlank = [cellId - (boardSize + 1),cellId- boardSize,cellId-(boardSize - 1),cellId - 1,cellId + 1,cellId +(boardSize- 1),cellId + boardSize,cellId + (boardSize  + 1)]  
      }

      cellIdsToCheckForBlank.forEach(id=>{
        //console.log(`CHECKING CELL----------------- ${id}`)
        if(boardState[id].holds == 'BLANK'){
          //console.log(`BLANK Found at ${id}`)
          blankCellIds.push(id)
          //console.log(`blankCellIds So FAR `, blankCellIds)
          if(blankCellIds.indexOf(id) == -1){
            getAllBlanks(id)
          }
        }
      })

    }
    
    getAllBlanks(cellId)
    
    blankCellIds.forEach(id=>{
      boardState[id].isExposed = true
    })

    this.setState({
      boardState
    })
  }


  handleExpose(e,cellIndex){
    const {boardState} = this.state
    //let bombs = 0
    let cellIdsToCheckForBomb = []
    let currentCell = boardState[cellIndex]
    if(e.type == 'contextmenu'){
      if(currentCell.isExposed == false){
        boardState[cellIndex].isFlagged = true
      }
    }else{
      if(currentCell.isExposed == false){
        boardState[cellIndex].isExposed = true
        boardState[cellIndex].isFlagged = false
        if(currentCell.holds == 'BOMB'){
          this.setState({
            isExploded: true
          })
        }else if(currentCell.holds == 'BLANK'){
            this.enableNeighboringBlankCells(boardState,cellIndex)
        }else{
          boardState[cellIndex].neighboringBombs = this.getNeighboringBombCount(boardState,cellIndex)
        }
      }
    }
    this.setState({
      boardState
    })
  }

  shouldCellBeDisabled(cell){
    if(cell.isFlagged){
      return false
    }else if(cell.isExposed){
        if(cell.holds == 'NUMBER'){
          return false
        }else{
          return cell.holds == 'BLANK' || cell.holds == 'BOMB'
        }
    }
    return false
  }

  render() {
    const {boardState,isExploded} = this.state
    const boardStatus = isExploded ? 'lost' : 'active'
    return (
      <Layout title={`Minesweeper (${boardStatus})`}>
        <Desk boardSize={boardSize}>
          {
              boardState.map(cell => {
                return(
                  <Square key={cell.id} disabled={this.shouldCellBeDisabled(cell)} onClick={e=>this.handleExpose(e,cell.id)} onContextMenu={e=>this.handleExpose(e,cell.id)}>
                    {cell.holds === 'BOMB' && cell.isExposed && <Mine /> }
                    {cell.holds === 'NUMBER' && cell.isExposed && cell.neighboringBombs }
                    {/* {cell.holds === 'BOMB' && <Mine /> }
                    {cell.holds === 'NUMBER' && cell.id } */}
                    {cell.isFlagged && <Flag />}
                  </Square>
                )
               })
          }
      </Desk>
    </Layout>
    )
  }
}


const cellStates = ['BOMB','NUMBER','BLANK']
const boardSize = 10
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
        id: i,
        holds: cellStates[Math.floor(Math.random() * 3)],
        neighboringBombs: 0,
        isExposed: false,
        isFlagged: false,
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
//         holds: fillCell(),
//         shown: false
//       })
//     }
//     boardState.push(row)
//     row = []
//   }
//   return boardState
// }
// function findBomb(cellIndex){
//   console.log(cellIndex)
//   let bombs = 0
//   let cellIdsToCheckForBomb = []
//   if(cellIndex == 0 || cellIndex == boardSize-1 || cellIndex == boardSize*boardSize - boardSize || cellIndex == boardSize*boardSize - 1){
//     console.log('Corner CLICKKKK');
//     debugger
//     switch(cellIndex){
//       case 0: 
//         cellIdsToCheckForBomb = [1,boardSize,boardSize+1,]
//         break
//       case boardSize-1: 
//         cellIdsToCheckForBomb = [cellIndex - 1,cellIndex +(boardSize- 1),cellIndex + boardSize]  
//         break
//       case boardSize*boardSize - boardSize: 
//        cellIdsToCheckForBomb = []  
//        break
//       case boardSize*boardSize - 1: 
//         cellIdsToCheckForBomb = []
//         break
//     }
//   }else if(cellIndex%boardSize == boardSize - 1){
//     /* Right Edge */
//     console.log('CLICK ON RIGHT EDGE');
//     cellIdsToCheckForBomb = [cellIndex - (boardSize + 1),cellIndex- boardSize,cellIndex - 1,cellIndex +(boardSize- 1),cellIndex + boardSize]
//   }else if(cellIndex%boardSize == 0){
//     /* Left Edge */
//     console.log('CLICK ON Left EDGE');
//     cellIdsToCheckForBomb = [cellIndex- boardSize,cellIndex-(boardSize - 1),cellIndex + 1,cellIndex + boardSize,cellIndex + (boardSize  + 1)]
//   }else if(cellIndex < boardSize){
//     /* Top Edge */
//     console.log('CLICK ON Top EDGE');
//     cellIdsToCheckForBomb = [cellIndex - 1,cellIndex +(boardSize- 1),cellIndex + boardSize,cellIndex + (boardSize  + 1),cellIndex + 1] 
//   }else if(cellIndex > (boardSize*boardSize) - boardSize && cellIndex < (boardSize*boardSize) - 1){
//     /* Bottom Edge */
//     console.log('Bottom Edge');
//     cellIdsToCheckForBomb = [cellIndex - 1,cellIndex - (boardSize + 1),cellIndex- boardSize,cellIndex-(boardSize - 1),cellIndex + 1]
//   }

//   cellIdsToCheckForBomb.forEach(cellIndex=>{
//     console.log(`CHECKING CELL----------------- ${cellIndex}`);
//     if(boardState[cellIndex].holds == 'BOMB'){
//       console.log(`Bomb Found at ${cellIndex}`);
//       bombs++
//     }
//   })

//   console.log(`BOMBS FOUND, ${bombs}`);
//   // for(let i = cellIndex - (boardSize+1); i <= cellIndex - (boardSize-1);i++){
//   //   console.log(`CHECKING CELL----------------- ${i}`);
//   //   if(cellIndex%boardSize != boardSize - 1){
//   //     if(boardState[i].holds == 'BOMB'){
//   //       console.log(`Bomb Found at ${i}`);
//   //       bombs++
//   //     }
//   //   }else{
//   //     console.log(`CLICKED ON EDGE CELL`);
//   //   }
//   // }
//   // for(let i = cellIndex -1; i <= cellIndex +1; i++){
//   //   console.log(`CHECKING CELL----------------- ${i}`);
//   //   if(boardState[i].holds == 'BOMB' && i != cellIndex){
//   //     console.log(`Bomb Found at ${i}`);
//   //     bombs++
//   //   }
//   // }
//   // for(let i = cellIndex + (boardSize-1); i <= cellIndex + (boardSize+1);i++){
//   //   console.log(`CHECKING CELL----------------- ${i}`);
//   //   if(boardState[i].holds == 'BOMB'){
//   //     console.log(`Bomb Found at ${i}`);
//   //     bombs++
//   //   }
//   // }
//   // console.log(`BOMBS FOUND, ${bombs}`);
// }

// const Index = () => {
// //   const boardState = []
// //   for(let i=0;i<100;i++){
// //     boardState.push({
// //       i: i,
// //       holds: cellStates[Math.floor(Math.random() * 3)],
// //       shown: false
// //     })
// // }
//   return(
//     <Layout title={`Minesweeper (active)`}>
//     <Desk boardSize={boardSize}>
//       {
//         boardState.map(cell => {
//           console.log(`Cell has ${cell.holds} rendering ${cell.id} `)
//           // console.log(`cell.holds === 'BLANK'`)
//           // console.log(`cell.holds === 'BOMB'`)
//           return(
//             <Square key={cell.id} disabled={cell.holds == 'BLANK' || cell.holds == 'BOMB' } onClick={()=>findBomb(cell.id)}>
//               {cell.holds === 'BOMB' && <Mine /> }
//               {cell.holds === 'NUMBER' && cell.id }
//               {/* <Mine /> */}
//               {/* {i === 25 && <Flag />}
//               {i === 77 ? '20' : ''} */}
//             </Square>
//           )
//       })
//     }
//     </Desk>
//   </Layout>
//   )
//   }

// export default Index;


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