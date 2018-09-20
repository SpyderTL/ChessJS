var colors = Object.freeze({ Black: 0, White: 1 });
var pieces = Object.freeze({ Pawn: 0, Rook: 1, Knight: 2, Bishop: 3, Queen: 4, King: 5 });

function createGame() {
	var board = [[], [], [], [], [], [], [], []];

	board[0][0] = { color: colors.Black, moves: 0, piece: pieces.Rook };
	board[0][1] = { color: colors.Black, moves: 0, piece: pieces.Knight };
	board[0][2] = { color: colors.Black, moves: 0, piece: pieces.Bishop };
	board[0][3] = { color: colors.Black, moves: 0, piece: pieces.Queen };
	board[0][4] = { color: colors.Black, moves: 0, piece: pieces.King };
	board[0][5] = { color: colors.Black, moves: 0, piece: pieces.Bishop };
	board[0][6] = { color: colors.Black, moves: 0, piece: pieces.Knight };
	board[0][7] = { color: colors.Black, moves: 0, piece: pieces.Rook };

	board[1][0] = { color: colors.Black, moves: 0, piece: pieces.Pawn };
	board[1][1] = { color: colors.Black, moves: 0, piece: pieces.Pawn };
	board[1][2] = { color: colors.Black, moves: 0, piece: pieces.Pawn };
	board[1][3] = { color: colors.Black, moves: 0, piece: pieces.Pawn };
	board[1][4] = { color: colors.Black, moves: 0, piece: pieces.Pawn };
	board[1][5] = { color: colors.Black, moves: 0, piece: pieces.Pawn };
	board[1][6] = { color: colors.Black, moves: 0, piece: pieces.Pawn };
	board[1][7] = { color: colors.Black, moves: 0, piece: pieces.Pawn };

	board[6][0] = { color: colors.White, moves: 0, piece: pieces.Pawn };
	board[6][1] = { color: colors.White, moves: 0, piece: pieces.Pawn };
	board[6][2] = { color: colors.White, moves: 0, piece: pieces.Pawn };
	board[6][3] = { color: colors.White, moves: 0, piece: pieces.Pawn };
	board[6][4] = { color: colors.White, moves: 0, piece: pieces.Pawn };
	board[6][5] = { color: colors.White, moves: 0, piece: pieces.Pawn };
	board[6][6] = { color: colors.White, moves: 0, piece: pieces.Pawn };
	board[6][7] = { color: colors.White, moves: 0, piece: pieces.Pawn };

	board[7][0] = { color: colors.White, moves: 0, piece: pieces.Rook };
	board[7][1] = { color: colors.White, moves: 0, piece: pieces.Knight };
	board[7][2] = { color: colors.White, moves: 0, piece: pieces.Bishop };
	board[7][3] = { color: colors.White, moves: 0, piece: pieces.Queen };
	board[7][4] = { color: colors.White, moves: 0, piece: pieces.King };
	board[7][5] = { color: colors.White, moves: 0, piece: pieces.Bishop };
	board[7][6] = { color: colors.White, moves: 0, piece: pieces.Knight };
	board[7][7] = { color: colors.White, moves: 0, piece: pieces.Rook };

	var game = { board: board, turn: colors.White };

	game.moves = getMoves(game, 0);

	return game;
}

function copy(game) {
	var board = [[], [], [], [], [], [], [], []];

	for (var row = 0; row < 8; row++) {
		for (var column = 0; column < 8; column++) {
			var position = game.board[row][column]

			if (position != undefined)
				board[row][column] = { color: position.color, moves: position.moves, piece: position.piece };
		}
	}

	return { board: board, turn: game.turn, lastMove: game.lastMove };
}

function execute(game, move, depth) {
	var position = game.board[move.currentRow][move.currentColumn];

	game.board[move.currentRow][move.currentColumn] = undefined;

	if (position.piece == pieces.Pawn) {
		// Queen
		if (move.row == 0 ||
			move.row == 7)
			position.piece = pieces.Queen;

		// En Passant
		if (move.column != move.currentColumn &&
			game.board[move.row][move.column] == undefined) {
			game.board[move.currentRow][move.column] = undefined;
		}
	}

	if (position.piece == pieces.King) {
		// Castle
		if (move.column == move.currentColumn + 2) {
			var castle = game.board[move.row][7];

			game.board[move.row][7] = undefined;

			game.board[move.row][move.column - 1] = castle;
		}

		if (move.column == move.currentColumn - 2) {
			var castle = game.board[move.row][0];

			game.board[move.row][0] = undefined;

			game.board[move.row][move.column + 1] = castle;
		}
	}

	position.moves++;

	game.board[move.row][move.column] = position;

	game.lastMove = move;

	game.turn = game.turn == colors.White ? colors.Black : colors.White;
	game.moves = getMoves(game, depth);
}

function getMoves(game, depth) {
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

						if (game.board[row - 1][column + 1] != undefined &&
							game.board[row - 1][column + 1].color != position.color)
							moves.push({ currentRow: row, currentColumn: column, row: row - 1, column: column + 1 });

						if (game.board[row - 1][column - 1] != undefined &&
							game.board[row - 1][column - 1].color != position.color)
							moves.push({ currentRow: row, currentColumn: column, row: row - 1, column: column - 1 });

						if (game.lastMove != undefined) {
							if (game.board[row][column + 1] != undefined &&
								game.board[row][column + 1].piece == pieces.Pawn &&
								game.lastMove.row == row &&
								game.lastMove.column == column + 1 &&
								game.lastMove.currentRow == row - 2)
								moves.push({ currentRow: row, currentColumn: column, row: row - 1, column: column + 1 });

							if (game.board[row][column - 1] != undefined &&
								game.board[row][column - 1].piece == pieces.Pawn &&
								game.lastMove.row == row &&
								game.lastMove.column == column - 1 &&
								game.lastMove.currentRow == row - 2)
								moves.push({ currentRow: row, currentColumn: column, row: row - 1, column: column - 1 });
						}
					}
					else {
						if (game.board[row + 1][column] == undefined) {
							moves.push({ currentRow: row, currentColumn: column, row: row + 1, column: column });

							if (row == 1 && game.board[row + 2][column] == undefined)
								moves.push({ currentRow: row, currentColumn: column, row: row + 2, column: column });
						}

						if (game.board[row + 1][column + 1] != undefined &&
							game.board[row + 1][column + 1].color != position.color)
							moves.push({ currentRow: row, currentColumn: column, row: row + 1, column: column + 1 });

						if (game.board[row + 1][column - 1] != undefined &&
							game.board[row + 1][column - 1].color != position.color)
							moves.push({ currentRow: row, currentColumn: column, row: row + 1, column: column - 1 });

						if (game.lastMove != undefined) {
							if (game.board[row][column + 1] != undefined &&
								game.board[row][column + 1].piece == pieces.Pawn &&
								game.lastMove.row == row &&
								game.lastMove.column == column + 1 &&
								game.lastMove.currentRow == row + 2)
								moves.push({ currentRow: row, currentColumn: column, row: row + 1, column: column + 1 });

							if (game.board[row][column - 1] != undefined &&
								game.board[row][column - 1].piece == pieces.Pawn &&
								game.lastMove.row == row &&
								game.lastMove.column == column - 1 &&
								game.lastMove.currentRow == row + 2)
								moves.push({ currentRow: row, currentColumn: column, row: row + 1, column: column - 1 });
						}
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

					if (position.moves == 0) {
						if (game.board[row][0] != undefined &&
							game.board[row][0].moves == 0 &&
							game.board[row][1] == undefined &&
							game.board[row][2] == undefined &&
							(column == 3 || game.board[row][3] == undefined))
							moves.push({ currentRow: row, currentColumn: column, row: row, column: column - 2 });

						if (game.board[row][7] != undefined &&
							game.board[row][7].moves == 0 &&
							game.board[row][6] == undefined &&
							game.board[row][5] == undefined &&
							(column == 4 || game.board[row][4] == undefined))
							moves.push({ currentRow: row, currentColumn: column, row: row, column: column + 2 });
					}

					break;
			}
		}
	}

	if (depth == 0)
		return moves;

	var validMoves = [];

	for (var move = 0; move < moves.length; move++) {
		var valid = true;
		var projection = copy(game);

		execute(projection, moves[move], depth - 1);

		for (var move2 = 0; move2 < projection.moves.length; move2++) {
			var target = projection.board[projection.moves[move2].row][projection.moves[move2].column];

			if (target != undefined &&
				target.piece == pieces.King) {
				valid = false;
				break;
			}
		}

		if (valid)
			validMoves.push(moves[move]);
	}

	return validMoves;
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
	var bestScore = -10000;

	for (var move = 0; move < game.moves.length; move++) {
		var projection = copy(game);

		execute(projection, game.moves[move], 1);

		var score = 0;

		score -= projection.moves.length;

		for (var row = 0; row < 8; row++) {
			for (var column = 0; column < 8; column++) {
				var position = projection.board[row][column];

				if (position == undefined)
					continue;
				else if (position.color != game.turn)
					score -= (position.piece + 5);
			}
		}

		if (score > bestScore) {
			bestScore = score;
			best = move;
		}
	}

	return best;
}