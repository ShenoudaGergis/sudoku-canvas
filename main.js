import Cell from "./cell.js";
import Solver from "./solver.js";
import util from "./util.js";

function Game(canvasID = "jesus" , {cellWidth = 50 , prop = 50} = {}) {
	this.canvas    = document.getElementById(canvasID);
	this.context   = this.canvas.getContext("2d");
	this.gameEnded = false;
	this.time      = 0;
	this.timer     = null;
	this.assets    = {};
	this.cellWidth = cellWidth;
	this.gapPixels = 3;
	this.prop      = prop;
	this.grid      = [];
	this.focusedCell = null;
	this.solver = new Solver(this.grid)
	this.infoBarHeight = 0;
	this.infoBarColor  = "#cef2ef"; 
	this.adjustDimension();
	this.generateGrid();
	this.clickEvent();
	this.keyEvent();
};

//-------------------------------------------------------------------------------------------------

Game.prototype.adjustDimension = function() {
	this.canvas.width  = this.cellWidth * 9 + this.gapPixels * 2;
	this.canvas.height = this.cellWidth * 9 + this.gapPixels * 2;
	this.infoBarHeight = util.getPercent(this.canvas.height , 12);
	this.canvas.height += this.infoBarHeight;

};

//-------------------------------------------------------------------------------------------------

Game.prototype.keyEvent = function() {
	document.onkeyup = (event) => {
		if(this.focusedCell === null) return;
		let key = event.key;
		switch(key) {
			case "1" : this.focusedCell.userValue = 1;break; 
			case "2" : this.focusedCell.userValue = 2;break;
			case "3" : this.focusedCell.userValue = 3;break;
			case "4" : this.focusedCell.userValue = 4;break;
			case "5" : this.focusedCell.userValue = 5;break;
			case "6" : this.focusedCell.userValue = 6;break;
			case "7" : this.focusedCell.userValue = 7;break;
			case "8" : this.focusedCell.userValue = 8;break;
			case "9" : this.focusedCell.userValue = 9;break;
		}
		if(this.checkWinLogic()) {this.gameEnded = true;this.infoBarColor = "#4BB543"};
	}
};

//-------------------------------------------------------------------------------------------------

Game.prototype.clickEvent = function() {
    function getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    this.canvas.onclick = ((event) => {
        if(this.gameEnded.ended) return;
        let mousePos = getMousePos(this.canvas, event);
        if(mousePos.y < 9 * this.cellWidth + 2 * this.gapPixels) {
            console.info(mousePos);
            let clickedCell = this.getCellFromCoor(mousePos.x , mousePos.y);
            if(!clickedCell.given && !clickedCell.focused) {
            	if(this.focusedCell !== null) this.focusedCell.focused = false;
            	clickedCell.focused = true;
            	this.focusedCell = clickedCell;
            	console.log(this.focusedCell)
            }
        }
    });
};

//-------------------------------------------------------------------------------------------------

Game.prototype.getCellFromCoor = function(x , y) {
	let xoffset = Math.floor(x / (3 * this.cellWidth)) * this.gapPixels;
	let yoffset = Math.floor(y / (3 * this.cellWidth)) * this.gapPixels;
    let col = Math.floor((x - xoffset) / this.cellWidth);
    let row = Math.floor((y - yoffset) / this.cellWidth);    
    return this.grid[row][col];
};

//-------------------------------------------------------------------------------------------------

Game.prototype.generateGrid = function() {
	let offsetx = 0 , offsety = 0;
	for(let i = 0;i < 9;i++) {
		offsetx = 0;
		this.grid.push([]);
		if(i % 3 === 0 && i !== 0) offsety += this.gapPixels;
		for(let j = 0;j < 9;j++) {
			let locationX = j * this.cellWidth , locationY = i * this.cellWidth;
			if(j % 3 === 0 && j !== 0) offsetx += this.gapPixels;
			let newCell = new Cell(this.canvas , locationX + offsetx , locationY + offsety , this.cellWidth , -1);
			if(util.generateRandomNumber(1 , 100) <= this.prop) newCell.given = true;
			this.grid[this.grid.length - 1].push(newCell);
		}
	}
	this.solver.shuffleStarter();
	this.solver.solve();
};

//-------------------------------------------------------------------------------------------------

Game.prototype.checkWinLogic = function() {
	let win = true;
	this.grid.forEach((row) => {
		row.forEach((cell) => {
			if(cell.given) return;
			if(cell.value !== cell.userValue) win = false;
		})
	})
	return win;
};

//-------------------------------------------------------------------------------------------------

Game.prototype.clearFrame = function() {
	this.context.clearRect(0 , 0 , this.canvas.width , this.canvas.height);
};

//-------------------------------------------------------------------------------------------------

Game.prototype.drawGameInfo = function() {
	this.context.fillStyle = this.infoBarColor;
	this.context.fillRect(0 , this.canvas.height - this.infoBarHeight , this.canvas.width , this.infoBarHeight);
	this.context.strokeRect(0 , this.canvas.height - this.infoBarHeight , this.canvas.width , this.infoBarHeight);
	this.context.fillStyle = "#000";
	let fontSize = util.getPercent(this.infoBarHeight , 20);
	this.context.font = `${fontSize}px atari2Font`;
	this.context.fillText(`Time ${util.toTime(this.time)}` , 10 , (this.canvas.height - this.infoBarHeight) + (this.infoBarHeight - fontSize) / 2 + fontSize);
};

//-------------------------------------------------------------------------------------------------

Game.prototype.drawFrame = function() {
	this.context.fillStyle = "#878282";
	this.context.fillRect(0 , 0 , this.canvas.width , this.canvas.height);
	this.grid.forEach((row) => {
		row.forEach((cell) => {
			cell.draw();
		})
	});
	this.drawGameInfo();
};

//-------------------------------------------------------------------------------------------------

Game.prototype.begin = function() {

    return util.loadAssets().then((results) => {
        results.forEach(({label , name , dom}) => {
            if(label === "image") {
                this.assets[name] = dom;
            }
            if(label === "sound") {
                this.assets[name] = new Sound(dom);
            }
            if(label === "font") {
                document.fonts.add(dom);
            }
        });
        this.timer = setInterval(() => {
            if(this.gameEnded) {clearInterval(this.timer);this.timer = null;}
            this.clearFrame();
            this.drawFrame();
            this.time += 40;
        } , 40);
        return results;    
    } , (results) => {
        throw results;
    });
};

//-------------------------------------------------------------------------------------------------


let game = new Game();
game.begin().then((results) => {
	console.log("jesus christ done")
} , (results) => {
	console.error("me error");
});