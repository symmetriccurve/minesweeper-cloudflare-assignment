import getNeighbors from './getNeighbors'

export default function getNeighboringBombCount(boardState, cellId) {
	let neighboringBombCount = 0
	let cellIdsToCheckForBomb = []
	cellIdsToCheckForBomb = getNeighbors(Math.sqrt(boardState.length), cellId)
	cellIdsToCheckForBomb.forEach(cellId => {
		//console.log(`CHECKING CELL----------------- ${cellId}`)
		if (boardState[cellId].holds == 'BOMB') {
			//console.log(`Bomb Found at ${cellId}`)
			neighboringBombCount++
		}
	})
	return neighboringBombCount
}