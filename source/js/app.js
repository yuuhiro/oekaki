var OekakiView = Backbone.View.extend({
	el: "#oekaki",
	initialize: function () {

		this.canvas = this.$el.find("#oekakiCanvas")[0];
		this.ctx = this.canvas.getContext('2d');
		
		this.offsetX = this.canvas.offsetLeft;
		this.offsetY = this.canvas.offsetTop;
		
		this.drawFlag = false;
		this.strokeStyle = 'black';
		this.lineWidth = 3;
	},
	events: {
		'mousedown #oekakiCanvas': 'drawStart',
		'mousemove #oekakiCanvas': 'draw',
		'mouseup #oekakiCanvas': 'drawEnd'
	},
	drawStart: function(e) {
		this.drawFlag = true;
		
		this.lastX = e.pageX - this.offsetX;
		this.lastY = e.pageY - this.offsetY;
	},
	drawEnd: function() {
		this.drawFlag = false;
	},
	draw: function(e) {
		if (!this.drawFlag) return;

		var x = e.pageX - this.offsetX;
		var y = e.pageY - this.offsetY;
		
		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.lineWidth = this.lineWidth;

		this.ctx.beginPath();
		this.ctx.moveTo(this.lastX, this.lastY);
		this.ctx.lineTo(x, y);
		this.ctx.lineCap = "round";
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.lineJoin = 'round';
		
		this.lastX = x;
		this.lastY = y;
	}
});
new OekakiView();
