import Layout from '../components/layout';
// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';

//game settings
import BoardSize from './components/BoardSize';
import BoardLevel from './components/BoardLevel';

import React, { Component } from 'react'

//utilities
import getNeighbors from './utilities/getNeighbors'
import generateBoard from './utilities/generateBoard'

export default class App extends Component {
  state = {
    boardState: generateBoard(10, 'EASY'),
    isExploded: false,
    boardSize: 10,
    level: 'EASY'
  }
 
  componentDidMount(){
	  console.log(window)
	  window.document.oncontextmenu = function() {
		return false;
	  }
  }

  exposeNeighboringCells(boardState, cellId) {
    var checkedCells = []
    const { boardSize } = this.state

    const checkNeighboringCells = (cellId) => {
      const neighbors = getNeighbors(boardSize, cellId)
      checkedCells = [cellId, ...checkedCells]
      /* Current Cell does not need a check as it is exposed and counted into checked cells */
      neighbors.forEach(id => {
        if (checkedCells.indexOf(id) === -1) {
          /* 
            Avoid checking neighbor's neighbor's neighbor which is same cell 

                                          a b c
                                          d e f
                                          g h i

            e is a neighbor to f, while checking for f's neighbor avoid checking e as it is already checked.
          */
          checkedCells.push(id)
          if (boardState[id].holds === 'BLANK') {
            checkNeighboringCells(id)
            /* if the neihbor cell is blank as well, do recursive until finding no blank neighbor*/
          }
        }
      })
    }

    checkNeighboringCells(cellId)

    checkedCells.forEach(id => {
      boardState[id].isExposed = true
      /* 
        At this point few cells might have already exposed, a additional check can be added to avoid expose of 
        exposed cells(https://stackify.com/premature-optimization-evil/)
      */
    })

    this.setState({
      boardState
    })
  }

  exposeAll() {
    let { boardState } = this.state
    boardState.forEach((cell, index) => {
      boardState[index].isExposed = true
      boardState[index].isFlagged = false
    })
    this.setState({
      boardState
    })
  }

  handleExpose(e, cellIndex) {
    const { boardState } = this.state
    let currentCell = boardState[cellIndex]
    if (e.type === 'contextmenu') {
      /* Check if the click is a right click */
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
          }, () => {
            this.exposeAll()
          })
        } else if (currentCell.holds === 'BLANK') {
          this.exposeNeighboringCells(boardState, cellIndex)
        } else {
          this.reveal.play()
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
    //console.log(`SETTING BOARD SIZE TO ${e.target.value}`)
    const boardSize = Number(e.target.value)
    const { level } = this.state
    this.setState({
      boardSize,
      boardState: generateBoard(boardSize, level)
    })
  }

  handleLevelChange(e) {
    //console.log(`SETTING LEVEL TO ${e.target.value}`)
    const level = e.target.value
    const { boardSize } = this.state
    this.setState({
      level,
      boardState: generateBoard(boardSize, level)
    })
  }

  render() {
    const { boardState, isExploded, boardSize, level } = this.state
    const boardStatus = isExploded ? 'lost' : 'active'
    return (
      <Layout title={`Minesweeper (${boardStatus})`} classname='board'>
        <div className='board__sounds'>
          <audio ref={reveal => { this.reveal = reveal }}>
            <source src="https://s3.amazonaws.com/freecodecamp/simonSound1.mp3" type="audio/mpeg" >
            </source>
          </audio>
          <audio ref={bomb => { this.bomb = bomb }}>
            <source src='https://vocaroo.com/media_command.php?media=s0xbwFZ8axIN&command=download_mp3' type="audio/mpeg" >
            </source>
          </audio>
        </div>
        <div className='board__settings' style={{ display: 'flex', margin: '1%' }}>
          <BoardSize value={boardSize} onChange={e => this.handleBoardSizeChange(e)} />
          <BoardLevel level={level} onChange={e => this.handleLevelChange(e)} />
        </div>
        <Desk boardSize={boardSize}>
          {
            boardState.map(cell => {
              return (
                <Square key={cell.id} disabled={this.shouldCellBeDisabled(cell)} onClick={e => this.handleExpose(e, cell.id)} onContextMenu={e => this.handleExpose(e, cell.id)}>
                  {cell.holds === 'BOMB' && cell.isExposed && <Mine />}
                  {cell.holds === 'NUMBER' && cell.isExposed && cell.neighboringBombCount.toString()}
                  {cell.isFlagged && !cell.isExposed && <Flag />}
                </Square>
              )
            })
          }
        </Desk>
      </Layout>
    )
  }
}