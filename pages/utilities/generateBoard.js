import getNeighbors from './getNeighbors'
import getNeighboringBombCount from './getNeighboringBombCount'
const bombFactorToLevels = { 'EASY': 4, 'MEDIUM': 3, 'HARD': 2 }

export default function generateBoard(size, level) {
    const cellCount = size * size
    let boardState = []
    for (let i = 0; i < cellCount; i++) {
        boardState.push({
            id: i,
            holds: 'NUMBER',
            neighboringBombCount: 0,
            isExposed: false,
            isFlagged: false,
        })
    }

    const bombLocations = placeBombs(size, level)
    bombLocations.forEach(id => {
        boardState[id].holds = 'BOMB'
    })

    boardState.forEach(eachCell => {
        if (eachCell.holds == 'BOMB') {
            let neighbors = []
            neighbors = getNeighbors(size, eachCell.id)
            neighbors.forEach(id => {
                if (boardState[id].holds == 'NUMBER') {
                    boardState[id].neighboringBombCount = getNeighboringBombCount(boardState, id)
                }
            })
        }
    })

    boardState.forEach(eachCell => {
        if (eachCell.holds == 'NUMBER' && eachCell.neighboringBombCount == 0) {
            boardState[eachCell.id].holds = 'BLANK'
        }
    })
    return boardState
}

function placeBombs(size, level) {
    let bombLocations = []
    const numberOfBombsToPlace = Math.floor(size * size / bombFactorToLevels[level])
    //console.log(`SETTING BOARD TO ${level} with Number of Bombs ${numberOfBombsToPlace}`)
    for (let i = 0; i <= numberOfBombsToPlace; i++) {
        bombLocations.push(Math.floor(Math.random() * size * size))
    }
    return bombLocations
}