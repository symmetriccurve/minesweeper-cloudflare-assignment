import Layout from '../components/layout';
// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';

import React, { Component } from 'react'
import getNeighbors from './utilities/getNeighbors'
import generateBoard from './utilities/generateBoard'
import getNeighboringBombCount from './utilities/getNeighboringBombCount'

export default class App extends Component {
  state = {
    boardState: generateBoard(2),
    isExploded: false,
    boardSize: 2
  }

  // getNeighboringBombCount(boardState,cellId){
  //   let neighboringBombCount = 0
  //   let cellIdsToCheckForBomb = []
  //   const {boardSize} = this.state
  //   cellIdsToCheckForBomb = getNeighbors(boardSize,cellId)

  //   cellIdsToCheckForBomb.forEach(cellId=>{
  //     console.log(`CHECKING CELL----------------- ${cellId}`)
  //     if(boardState[cellId].holds == 'BOMB'){
  //       console.log(`Bomb Found at ${cellId}`)
  //       neighboringBombCount++
  //     }
  //   })
  //   return neighboringBombCount
  // }


  enableNeighboringBlankCells(boardState,cellId){
    let blankCells = []
    let cellIdsToCheckForBlank = []
    var blankCellIds = []
    var nonBlankCells = []
    const {boardSize} = this.state

    const getAllBlanks = (cellId) => {
      const neighbors = getNeighbors(boardSize,cellId)

      neighbors.forEach(id=>{
        if(boardState[id].holds == 'BLANK'){
          blankCellIds.push(id)
          if(blankCellIds.indexOf(id) == -1){
            getAllBlanks(id)
          }
        }else if(boardState[id].holds == 'BOMB'|| boardState[id].holds == 'NUMBER'){
            //nonBlankCells.push(id)
        }
      })
    }
    
    getAllBlanks(cellId)
    
    console.log(`Found BOMB AT NEIGHTBHOR BLANK, at`,nonBlankCells)

    blankCellIds.forEach(id=>{
      boardState[id].isExposed = true
    })

    nonBlankCells.forEach(id=>{
      if(boardState[id].isExposed == false){
        boardState[id].isExposed = true
        // boardState[id].holds = 'NUMBER'
        boardState[id].neighboringBombs = getNeighboringBombCount(boardState,id)
      }
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
          boardState[cellIndex].neighboringBombs = getNeighboringBombCount(boardState,cellIndex)
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

  handleBoardSizeChange(e){
    console.log('boardSize',e.target.value);
    const boardSize = Number(e.target.value)
    this.setState({
      boardSize,
      boardState: generateBoard(boardSize)
    })
    
  }

  render() {
    const {boardState,isExploded,boardSize} = this.state
    const boardStatus = isExploded ? 'lost' : 'active'
    return (
      <Layout title={`Minesweeper (${boardStatus})`}>
        <select onChange={e=>this.handleBoardSizeChange(e)} value={boardSize}>
          <option value={1}> 1 </option>
          <option value={2}> 2 </option>
          <option value={3}> 3 </option>
          <option value={4}> 4 </option>
          <option value={5}> 5 </option>
        </select>
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