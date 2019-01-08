export default function getNeighbors(boardSize, cellId) {
	let neighbors = []
	if (
		cellId == 0 ||
		cellId == boardSize - 1 ||
		cellId == boardSize * boardSize - boardSize ||
		cellId == boardSize * boardSize - 1
	) {
		/* Corners */
		switch (cellId) {
			case 0:
				/* Top Left */
				neighbors = [1, boardSize, boardSize + 1]
				break
			case boardSize - 1:
				/* Top Right */
				neighbors = [cellId - 1, cellId + (boardSize - 1), cellId + boardSize]
				break
			case boardSize * boardSize - boardSize:
				/* Bottom Left */
				neighbors = [cellId - boardSize, cellId - (boardSize - 1), cellId + 1]
				break
			case boardSize * boardSize - 1:
				/* Bottom Right */
				neighbors = [cellId - 1, cellId - (boardSize + 1), cellId - boardSize]
				break
		}
	} else if (cellId % boardSize == boardSize - 1) {
		/* Right Edge */
		neighbors = [
			cellId - (boardSize + 1),
			cellId - boardSize, cellId - 1,
			cellId + (boardSize - 1),
			cellId + boardSize
		]
	} else if (cellId % boardSize == 0) {
		/* Left Edge */
		neighbors = [cellId - boardSize, cellId - (boardSize - 1), cellId + 1, cellId + boardSize, cellId + (boardSize + 1)]
	} else if (cellId < boardSize) {
		/* Top Edge */
		neighbors = [cellId - 1, cellId + (boardSize - 1), cellId + boardSize, cellId + (boardSize + 1), cellId + 1]
	} else if (cellId > (boardSize * boardSize) - boardSize && cellId < (boardSize * boardSize) - 1) {
		/* Bottom Edge */
		neighbors = [cellId - 1, cellId - (boardSize + 1), cellId - boardSize, cellId - (boardSize - 1), cellId + 1]
	} else {
		neighbors = [cellId - (boardSize + 1), cellId - boardSize, cellId - (boardSize - 1), cellId - 1, cellId + 1, cellId + (boardSize - 1), cellId + boardSize, cellId + (boardSize + 1)]
	}
	return neighbors
}