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
    boardState: generateBoard(10),
    isExploded: false,
    boardSize: 10
  }

  enableNeighboringBlankCells(boardState, cellId) {
    var blankCellIds = []
    var nonBlankCells = []
    const { boardSize } = this.state

    const getAllBlanks = (cellId) => {
      const neighbors = getNeighbors(boardSize, cellId)

      neighbors.forEach(id => {
        if (boardState[id].holds === 'BLANK') {
          blankCellIds.push(id)
          if (blankCellIds.indexOf(id) === -1) {
            getAllBlanks(id)
          }
        } else if (boardState[id].holds === 'BOMB' || boardState[id].holds === 'NUMBER') {
            //nonBlankCells.push(id)
        }
      })
    }
    getAllBlanks(cellId)

    blankCellIds.forEach(id => {
      boardState[id].isExposed = true
    })

    nonBlankCells.forEach(id => {
      if (boardState[id].isExposed === false) {
        boardState[id].isExposed = true
        // boardState[id].holds = 'NUMBER'
        boardState[id].neighboringBombCount = getNeighboringBombCount(boardState, id)
      }
    })

    this.setState({
      boardState
    })
  }

  handleExpose(e, cellIndex) {
    const { boardState } = this.state
    let currentCell = boardState[cellIndex]
    if (e.type === 'contextmenu') {
      if (currentCell.isExposed === false) {
        boardState[cellIndex].isFlagged = true
      }
    } else {
      if (currentCell.isExposed === false) {
        boardState[cellIndex].isExposed = true
        boardState[cellIndex].isFlagged = false
        if (currentCell.holds === 'BOMB') {
          this.bomb.play()
          this.setState({
            isExploded: true
          })
        } else if (currentCell.holds === 'BLANK') {
          this.enableNeighboringBlankCells(boardState, cellIndex)
        } else {
          this.reveal.play()
          boardState[cellIndex].neighboringBombs = getNeighboringBombCount(boardState, cellIndex)
        }
      }
    }
    this.setState({
      boardState
    })
  }

  shouldCellBeDisabled(cell) {
    if (cell.isFlagged) {
      return false
    } else if (cell.isExposed) {
      if (cell.holds === 'NUMBER') {
        return false
      } else {
        return cell.holds === 'BLANK' || cell.holds === 'BOMB'
      }
    }
    return false
  }

  handleBoardSizeChange(e) {
    console.log('boardSize', e.target.value);
    const boardSize = Number(e.target.value)
    this.setState({
      boardSize,
      boardState: generateBoard(boardSize)
    })

  }

  render() {
    const { boardState, isExploded, boardSize } = this.state
    const boardStatus = isExploded ? 'lost' : 'active'
    return (
      <Layout title={`Minesweeper (${boardStatus})`}>
      <audio ref={reveal => { this.reveal = reveal }}>
        <source src="https://s3.amazonaws.com/freecodecamp/simonSound1.mp3" type="audio/mpeg" >
        </source>
      </audio>
      <audio ref={bomb => { this.bomb = bomb }}>
        <source src='https://vocaroo.com/media_command.php?media=s0xbwFZ8axIN&command=download_mp3' type="audio/mpeg" >
        </source>
      </audio>
        <select onChange={e => this.handleBoardSizeChange(e)} value={boardSize}>
          <option value={1}> 1 </option>
          <option value={2}> 2 </option>
          <option value={3}> 3 </option>
          <option value={4}> 4 </option>
          <option value={5}> 5 </option>
          <option value={6}> 6 </option>
          <option value={7}> 7 </option>
          <option value={8}> 8 </option>
          <option value={9}> 9 </option>
          <option value={10}> 10 </option>
        </select>
        <Desk boardSize={boardSize}>
          {
            boardState.map(cell => {
              return (
                <Square key={cell.id} disabled={this.shouldCellBeDisabled(cell)} onClick={e => this.handleExpose(e, cell.id)} onContextMenu={e => this.handleExpose(e, cell.id)}>
                  {cell.holds === 'BOMB' && cell.isExposed && <Mine />}
                  {cell.holds === 'NUMBER' && cell.isExposed && cell.neighboringBombs}
                  {/* {cell.holds ==== 'BOMB' && <Mine /> }
                    {cell.holds ==== 'NUMBER' && cell.id } */}
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