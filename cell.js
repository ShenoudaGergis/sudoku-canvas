import util from "./util.js";

export default function Cell(canvas , x , y , w , v) {
	this.canvas  = canvas;
	this.context = this.canvas.getContext("2d");
	this.value   = -1;
	this.userValue = -1;
	this.focused   = false;
	this.given     = false;
	this.x = x;
	this.y = y;
	this.w = w;
	this.fontSize = util.getPercent(this.w , 23);
	this.cellNotFocusColor       = "#FFF";
	this.cellFocusColor          = "#c4b7b5";
	this.cellStrokeFocusColor    = "#bdc3c7";
	this.cellStrokeNotFocusColor = "#bdc3c7";
	this.cellGivenColor          = "#ecf0f1";
	this.cellGivenStrokeColor    = "#bdc3c7";
	this.numberColor             = "#54524c";

}

//-------------------------------------------------------------------------------------------------

Cell.prototype.draw = function() {
	this.context.font = `${this.fontSize}px atari2Font`;
	if(this.given) {
		this.context.fillStyle   = this.cellGivenColor;
		this.context.strokeStyle = this.cellGivenStrokeColor;
	
	} else if(this.focused) {
		this.context.fillStyle   = this.cellFocusColor;
		this.context.strokeStyle = this.cellStrokeFocusColor;

	} else {
		this.context.fillStyle   = this.cellNotFocusColor;
		this.context.strokeStyle = this.cellStrokeNotFocusColor;
	}

	this.context.fillRect(this.x , this.y , this.w , this.w);
	this.context.strokeRect(this.x , this.y , this.w , this.w);

	if(this.given) {
		this.context.fillStyle = this.numberColor;
		this.context.fillText(this.value , this.x + (this.w - this.fontSize) / 2 , this.y + (this.w - this.fontSize) / 2 + this.fontSize);
	} else if(this.userValue !== -1) {
		this.context.fillStyle = this.numberColor;
		this.context.fillText(this.userValue , this.x + (this.w - this.fontSize) / 2 , this.y + (this.w - this.fontSize) / 2 + this.fontSize);		
	}

}