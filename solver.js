import util from "./util.js";

export default function Solver(grid) {
	this.grid = grid;
}

//-------------------------------------------------------------------------------------------------

Solver.prototype.getShuffleIndeces = function() {
	let result = [[]] , i = 0;
	for(let j = 0;j < 9;j++) {
		if(j % 3 === 0 && j !== 0) {
			i += 3;
			result.push([]);
		}
		result[result.length - 1].push({i : i + 0 , j : j});
		result[result.length - 1].push({i : i + 1 , j : j});
		result[result.length - 1].push({i : i + 2 , j : j});
	}

	return result;
};

//-------------------------------------------------------------------------------------------------

Solver.prototype.shuffleStarter = function() {
	this.getShuffleIndeces().forEach((block) => {
		let numbers = [1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9];
		block.forEach((cellPos) => {
			let index = util.generateRandomNumber(0 , numbers.length - 1);
			this.grid[cellPos.i][cellPos.j].value = numbers[index];
			numbers.splice(index , 1);
		})
	});
}

//-------------------------------------------------------------------------------------------------

Solver.prototype.checkRow = function(row) {
	let gridRow = this.grid[row];
	let numbers = [];

	gridRow.forEach((cell) => {
		if(cell.value === -1) return;
		numbers.push(cell.value);
	});

	if(util.getUnique(numbers).length === numbers.length) return true;
	else return false; 

}

//-------------------------------------------------------------------------------------------------

Solver.prototype.checkCol = function(col) {
	let gridCol = [];
	let numbers = [];

	this.grid.forEach((row) => {
		gridCol.push(row[col]);
	});

	gridCol.forEach((cell) => {
		if(cell.value === -1) return;
		numbers.push(cell.value);
	});

	if(util.getUnique(numbers).length === numbers.length) return true;
	else return false; 

}

//-------------------------------------------------------------------------------------------------

Solver.prototype.checkBlock = function(row , col) {
	let startRowIndex = Math.floor(row / 3) * 3;
	let startColIndex = Math.floor(col / 3) * 3;
	let numbers = [];

	let gridBlock = [
		this.grid[startRowIndex + 0][startColIndex + 0] ,
		this.grid[startRowIndex + 0][startColIndex + 1] ,
		this.grid[startRowIndex + 0][startColIndex + 2] ,
		
		this.grid[startRowIndex + 1][startColIndex + 0] ,
		this.grid[startRowIndex + 1][startColIndex + 1] ,
		this.grid[startRowIndex + 1][startColIndex + 2] ,
		
		this.grid[startRowIndex + 2][startColIndex + 0] ,
		this.grid[startRowIndex + 2][startColIndex + 1] ,
		this.grid[startRowIndex + 2][startColIndex + 2] ,

	];
	gridBlock.forEach((cell) => {
		if(cell.value === -1) return;
		numbers.push(cell.value);
	});

	if(util.getUnique(numbers).length === numbers.length) return true;
	else return false; 

}

//-------------------------------------------------------------------------------------------------

Solver.prototype.nextPosition = function({i , j}) {
	if(i === 8 && j === 8) return {i : null , j : null};
	if(j !== 8) return {i : i , j : j + 1};
	if(j === 8) return {i : i + 1 , j : 0};
}

//-------------------------------------------------------------------------------------------------

Solver.prototype.prevPosition = function({i , j}) {
	if(i === 0 && j === 0) return {i : null , j : null};
	if(j !== 0) return {i : i , j : j - 1};
	if(j === 0) return {i : i - 1 , j : 8};
}

//-------------------------------------------------------------------------------------------------

// Solver.prototype.solve = function(state = 0 , {i = 0 , j = 0} = {}) {
// 	if(i === null && j === null) return;

// 	let cell = this.grid[i][j];
// 	if(state === 1) {
// 		if(cell.value === 9) {
// 			cell.value = -1;
// 			this.solve(1 , this.prevPosition({i , j}));
// 			return;
// 		} else {
// 			cell.value++;
// 			if(this.checkRow(i) && this.checkCol(j) && this.checkBlock(i , j)) {
// 				this.solve(0 , this.nextPosition({i , j}));
// 				return;
// 			} else {
// 				this.solve(1 , {i , j});
// 				return;
// 			}
// 		}
// 	}
// 	if(cell.value !== -1 && state === 0) {this.solve(0 , this.nextPosition({i , j}));return}
// 	if(cell.value === -1 && state === 0) {
// 		cell.value = 1;
// 		if(this.checkRow(i) && this.checkCol(j) && this.checkBlock(i , j)) {
// 			this.solve(0 , this.nextPosition({i , j}));
// 			return;
// 		} else {
// 			this.solve(1 , {i , j});
// 			return;
// 		}
// 	}
// }

//-------------------------------------------------------------------------------------------------

Solver.prototype.solve = function() {
	let i= 0,j = 0,s = 0,cell = null;
	while(i !== null && j !== null) {
		cell = this.grid[i][j];
		if(s === 0 && cell.value !== -1) {
			({i , j} = this.nextPosition({i , j}));
			continue;			
		}
		if(s === 0 && cell.value === -1) {
			cell.value = 1;
			if(this.checkRow(i) && this.checkCol(j) && this.checkBlock(i , j)) {
				({i , j} = this.nextPosition({i , j}));
				s = 0;
				continue;
			} else {
				s = 1;
				continue;
			}
		}
		if(s === 1) {
			if(cell.value !== 9) {
				cell.value++;
				if(this.checkRow(i) && this.checkCol(j) && this.checkBlock(i , j)) {
					({i , j} = this.nextPosition({i , j}));
					s = 0;
					continue;
				} else {
					continue;
				}				
			} else {
				cell.value = -1;
				({i , j} = this.prevPosition({i , j}));
			}
		} 
	};
}

