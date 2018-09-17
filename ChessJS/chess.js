var colors = Object.freeze({ Black: 0, White: 1 });
var pieces = Object.freeze({ Pawn: 0, Rook: 1, Knight: 2, Bishop: 3, Queen: 4, King: 5 });

function createGame() {
	var board = [[], [], [], [], [], [], [], []];

	board[0][0] = { color: colors.Black, piece: pieces.Rook };
	board[0][1] = { color: colors.Black, piece: pieces.Knight };
	board[0][2] = { color: colors.Black, piece: pieces.Bishop };
	board[0][3] = { color: colors.Black, piece: pieces.Queen };
	board[0][4] = { color: colors.Black, piece: pieces.King };
	board[0][5] = { color: colors.Black, piece: pieces.Bishop };
	board[0][6] = { color: colors.Black, piece: pieces.Knight };
	board[0][7] = { color: colors.Black, piece: pieces.Rook };

	board[1][0] = { color: colors.Black, piece: pieces.Pawn };
	board[1][1] = { color: colors.Black, piece: pieces.Pawn };
	board[1][2] = { color: colors.Black, piece: pieces.Pawn };
	board[1][3] = { color: colors.Black, piece: pieces.Pawn };
	board[1][4] = { color: colors.Black, piece: pieces.Pawn };
	board[1][5] = { color: colors.Black, piece: pieces.Pawn };
	board[1][6] = { color: colors.Black, piece: pieces.Pawn };
	board[1][7] = { color: colors.Black, piece: pieces.Pawn };

	board[6][0] = { color: colors.White, piece: pieces.Pawn };
	board[6][1] = { color: colors.White, piece: pieces.Pawn };
	board[6][2] = { color: colors.White, piece: pieces.Pawn };
	board[6][3] = { color: colors.White, piece: pieces.Pawn };
	board[6][4] = { color: colors.White, piece: pieces.Pawn };
	board[6][5] = { color: colors.White, piece: pieces.Pawn };
	board[6][6] = { color: colors.White, piece: pieces.Pawn };
	board[6][7] = { color: colors.White, piece: pieces.Pawn };

	board[7][0] = { color: colors.White, piece: pieces.Rook };
	board[7][1] = { color: colors.White, piece: pieces.Knight };
	board[7][2] = { color: colors.White, piece: pieces.Bishop };
	board[7][3] = { color: colors.White, piece: pieces.Queen };
	board[7][4] = { color: colors.White, piece: pieces.King };
	board[7][5] = { color: colors.White, piece: pieces.Bishop };
	board[7][6] = { color: colors.White, piece: pieces.Knight };
	board[7][7] = { color: colors.White, piece: pieces.Rook };

	var game = { board: board, turn: colors.White };

	game.moves = getMoves(game);

	return game;
}

function copy(game) {
	var board = [[], [], [], [], [], [], [], []];

	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var position = game.board[row, column];

			if (position != undefined)
				board[row][column] = { color: position.color, piece: position.piece };
		}
	}

	return { board: board, turn: game.turn };
}

function execute(game, move) {
	var position = game.board[move.currentRow][move.currentColumn];

	game.board[move.currentRow][move.currentColumn] = undefined;

	if (position.piece == pieces.Pawn) {
		if (move.row == 0 ||
			move.row == 7)
			position.piece = pieces.Queen;
	}

	game.board[move.row][move.column] = position;

	game.turn = game.turn == colors.White ? colors.Black : colors.White;
	game.moves = getMoves(game);
}

function getMoves(game) {
	var moves = [];

	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var position = game.board[row][column];

			if (position == undefined ||
				position.color != game.turn)
				continue;

			switch (position.piece) {
				case pieces.Pawn:
					if (position.color == colors.White) {
						if (game.board[row - 1][column] == undefined) {
							moves.push({ currentRow: row, currentColumn: column, row: row - 1, column: column });

							if (row == 6 && game.board[row - 2][column] == undefined)
								moves.push({ currentRow: row, currentColumn: column, row: row - 2, column: column });
						}

						if (game.board[row - 1][column + 1] != undefined)
							moves.push({ currentRow: row, currentColumn: column, row: row - 1, column: column + 1 });

						if (game.board[row - 1][column - 1] != undefined)
							moves.push({ currentRow: row, currentColumn: column, row: row - 1, column: column - 1 });
					}
					else {
						if (game.board[row + 1][column] == undefined) {
							moves.push({ currentRow: row, currentColumn: column, row: row + 1, column: column });

							if (row == 1 && game.board[row + 2][column] == undefined)
								moves.push({ currentRow: row, currentColumn: column, row: row + 2, column: column });
						}

						if (game.board[row + 1][column + 1] != undefined)
							moves.push({ currentRow: row, currentColumn: column, row: row + 1, column: column + 1 });

						if (game.board[row + 1][column - 1] != undefined)
							moves.push({ currentRow: row, currentColumn: column, row: row + 1, column: column - 1 });
					}
					break;

				case pieces.Rook:
					var directions = [north(row, column), south(row, column), east(row, column), west(row, column)];

					for (var d = 0; d < directions.length; d++) {
						var positions = directions[d];

						for (var p = 0; p < positions.length; p++) {
							var destination = game.board[positions[p].row][positions[p].column];

							if (destination == undefined)
								moves.push({ currentRow: row, currentColumn: column, row: positions[p].row, column: positions[p].column });
							else if (destination.color != position.color) {
								moves.push({ currentRow: row, currentColumn: column, row: positions[p].row, column: positions[p].column });
								break;
							}
							else
								break;
						}
					}

					break;

				case pieces.Knight:
					var positions = knight(row, column);

					for (var p = 0; p < positions.length; p++) {
						var destination = game.board[positions[p].row][positions[p].column];

						if (destination == undefined ||
							destination.color != position.color)
							moves.push({ currentRow: row, currentColumn: column, row: positions[p].row, column: positions[p].column });
					}

					break;

				case pieces.Bishop:
					var directions = [northeast(row, column), southeast(row, column), southwest(row, column), northwest(row, column)];

					for (var d = 0; d < directions.length; d++) {
						var positions = directions[d];

						for (var p = 0; p < positions.length; p++) {
							var destination = game.board[positions[p].row][positions[p].column];

							if (destination == undefined)
								moves.push({ currentRow: row, currentColumn: column, row: positions[p].row, column: positions[p].column });
							else if (destination.color != position.color) {
								moves.push({ currentRow: row, currentColumn: column, row: positions[p].row, column: positions[p].column });
								break;
							}
							else
								break;
						}
					}

					break;

				case pieces.Queen:
					var directions = [north(row, column), northeast(row, column), east(row, column), southeast(row, column), south(row, column), southwest(row, column), west(row, column), northwest(row, column)];

					for (var d = 0; d < directions.length; d++) {
						var positions = directions[d];

						for (var p = 0; p < positions.length; p++) {
							var destination = game.board[positions[p].row][positions[p].column];

							if (destination == undefined)
								moves.push({ currentRow: row, currentColumn: column, row: positions[p].row, column: positions[p].column });
							else if (destination.color != position.color) {
								moves.push({ currentRow: row, currentColumn: column, row: positions[p].row, column: positions[p].column });
								break;
							}
							else
								break;
						}
					}

					break;

				case pieces.King:
					var directions = [north(row, column), northeast(row, column), east(row, column), southeast(row, column), south(row, column), southwest(row, column), west(row, column), northwest(row, column)];

					for (var d = 0; d < directions.length; d++) {
						var positions = directions[d];

						for (var p = 0; p < positions.length; p++) {
							var destination = game.board[positions[p].row][positions[p].column];

							if (destination == undefined ||
								destination.color != position.color)
								moves.push({ currentRow: row, currentColumn: column, row: positions[p].row, column: positions[p].column });

							break;
						}
					}

					break;
			}
		}
	}

	return moves;
}

function knight(row, column) {
	var destinations = [
		{ row: row - 1, column: column + 2 },
		{ row: row + 1, column: column + 2 },
		{ row: row + 2, column: column + 1 },
		{ row: row + 2, column: column - 1 },
		{ row: row - 1, column: column - 2 },
		{ row: row + 1, column: column - 2 },
		{ row: row - 2, column: column - 1 },
		{ row: row - 2, column: column + 1 },
	];

	return $.grep(destinations, function (item, index) {
		return item.row > -1 &&
			item.row < 8 &&
			item.column > -1 &&
			item.column < 8;
	});
}

function north(row, column) {
	var destinations = [];

	while (row > 0) {
		row--;

		destinations.push({ row: row, column: column });
	}

	return destinations;
}

function south(row, column) {
	var destinations = [];

	while (row < 7) {
		row++

		destinations.push({ row: row, column: column });
	}

	return destinations;
}

function east(row, column) {
	var destinations = [];

	while (column < 7) {
		column++;

		destinations.push({ row: row, column: column });
	}

	return destinations;
}

function west(row, column) {
	var destinations = [];

	while (column > 0) {
		column--;

		destinations.push({ row: row, column: column });
	}

	return destinations;
}

function northeast(row, column) {
	var destinations = [];

	while (row > 0 && column < 7) {
		row--;
		column++;

		destinations.push({ row: row, column: column });
	}

	return destinations;
}

function southeast(row, column) {
	var destinations = [];

	while (row < 7 && column < 7) {
		row++
		column++;

		destinations.push({ row: row, column: column });
	}

	return destinations;
}

function southwest(row, column) {
	var destinations = [];

	while (row < 7 && column > 0) {
		row++;
		column--;

		destinations.push({ row: row, column: column });
	}

	return destinations;
}

function northwest(row, column) {
	var destinations = [];

	while (row > 0 && column > 0) {
		row--;
		column--;

		destinations.push({ row: row, column: column });
	}

	return destinations;
}

function boa(game) {
	var best = 0;
	var bestScore = -1000;

	for (var move = 0; move < game.moves.length; move++) {
		var projection = copy(game);

		execute(projection, game.moves[move]);

		var score = 0;

		score -= projection.moves.length;

		if (score > bestScore) {
			score = bestScore;
			best = move;
		}
	}

	return best;
}