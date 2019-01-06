const cellStates = ['BOMB', 'NUMBER', 'BLANK']
import getNeighbors from './getNeighbors'
export default function generateBoard(size) {
    const cellCount = size * size
    const blankCells = []
    let boardState = []
    for (let i = 0; i < cellCount; i++) {
        boardState.push({
            id: i,
            holds: cellStates[Math.floor(Math.random() * 3)],
            neighboringBombCount: 0,
            isExposed: false,
            isFlagged: false,
        })
    }
    let neighbors = []

    // boardState.forEach(eachCell=>{
    //     if(eachCell.holds == 'BLANK'){
    //         neighbors = getNeighbors(size,eachCell.id)
    //         neighbors.forEach(id=>{
    //             boardState[id].holds = 'NUMBER'
    //         })
    //         blankCells.push(eachCell.id)
    //     }
    // })
    console.log(`FOUND BLANK AT`, blankCells)
    console.log(`neighbors  AT`, neighbors)
    return boardState
}