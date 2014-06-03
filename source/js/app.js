var OekakiView = Backbone.View.extend({
	el: "#oekaki",
	initialize: function () {

		this.canvas = this.$el.find("#oekakiCanvas")[0];
		this.ctx = this.canvas.getContext('2d');

		this.offsetX = this.canvas.offsetLeft;
		this.offsetY = this.canvas.offsetTop;
		this.canvasWidth = this.canvas.width;
		this.canvasHeight = this.canvas.height;
		
		this.ratio = 2.3; // 縦横比
		this.drawFlag = false;
		this.drawMode = "";
		this.strokeStyle = 'black';
		this.lineWidth = 2;

		this.square = {
			width: "",
			height: "",
			corners:[]
		};

		// 矩形を描画
		this.render(50, 50, 100*this.ratio, 100);
	},
	events: {
		'mousedown #oekakiCanvas': 'mouseDownHandler',
		'mousemove #oekakiCanvas': 'mouseMoveHandler',
		'mouseup #oekakiCanvas': 'mouseUpHandler'
	},
	mouseDownHandler: function(e) {
		this.drawFlag = true;
		
		// クリック時のマウスx,y座標を取得
		this.startX = e.pageX - this.offsetX;
		this.startY = e.pageY - this.offsetY;

		// 矩形の四隅の座標が格納されているか確認する（既に矩形が描画されているか）
		if(this.square.corners.length)
		{
			// マウスx,y座標と、矩形基点、終点x,y座標を比較して矩形を移動する必要があるか判定する
			if(this.startX > this.square.corners[0].x
			&& this.startX < this.square.corners[2].x
			&& this.startY > this.square.corners[0].y
			&& this.startY < this.square.corners[2].y
			)
			{
				this.drawMode = "move";
				return;
			}
			else
			{
				if(this.startX < this.square.cx)
				{
					if(this.startY < this.square.cy)
					{
						this.drawMode = 1;
					}
					else
					{
						this.drawMode = 3;
					}
				}
				else
				{
					if(this.startY < this.square.cy)
					{
						this.drawMode = 2;
					}
					else
					{
						this.drawMode = 4;
					}
				}
			}
		}
	},
	mouseUpHandler: function() {
		console.log(this.square);
		this.drawFlag = false;
	},
	mouseMoveHandler: function(e) {
		if (!this.drawFlag) return;

		var width, // 矩形の幅
			height, // 矩形の高さ
			currentX, // マウス移動時のx座標
			currentY, // マウス移動時のy座標
			distanceX, // クリック時のマウスx座標からのx軸移動距離
			distanceY, // クリック時のマウスx座標からのy軸移動距離
			basePointX, // 矩形の基点となるx座標（矩形の左上）
			basePointY, // 矩形の基点となるy座標（矩形の左上）
			endPointX, // 矩形の終点となるx座標（矩形の右下）
			endPointY; // 矩形の終点となるy座標（矩形の右下）

		// マウス移動時のx,y座標を取得
		currentX = e.pageX - this.offsetX;
		currentY = e.pageY - this.offsetY;

		// マウス移動時のx,y座標とクリック時のx,y座標からマウス移動距離を取得
		distanceX = currentX - this.startX;
		distanceY = currentY - this.startY;

		// 移動前のマウスx,y座標をキャッシュ（クリック時の座標ではない）
		this.startX = currentX;
		this.startY = currentY;

		if(this.drawMode === "move")
		{
			// 矩形の移動時は、移動前の矩形の基点x,y座標に移動距離をプラスして
			// 新たな矩形の基点座標を導きだす
			basePointX = this.square.corners[0].x + distanceX;
			basePointY = this.square.corners[0].y + distanceY;

			// 移動時は矩形のwidthとheightは変わらない
			width = this.square.width;
			height = this.square.height;
		}
		else
		{
			switch(this.drawMode){
			case 1:
				basePointX = this.square.corners[0].x + distanceX;
				basePointY = this.square.corners[0].y + distanceY;
			break;
			case 2:
				basePointX = this.square.corners[3].x;
				basePointY = this.square.corners[3].y;
			break;
			case 3:
				basePointX = this.square.corners[1].x;
				basePointY = this.square.corners[1].y;
			break;
			case 4:
				basePointX = this.square.corners[0].x;
				basePointY = this.square.corners[0].y;
			break;
			}
			width = this.square.width + Math.abs(distanceX);
			height = this.square.height + Math.abs(distanceY);
		}

		// 矩形を描画
		this.render(basePointX, basePointY, width, height);
	},
	render: function(x, y, width, height) {
		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.lineWidth = this.lineWidth;

		// 以前の矩形が残っているので、一度canvasをクリアする
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		this.ctx.strokeRect(x, y, width, height);

		// 矩形の幅、高さと四隅の座標を格納
		this.square = {
			width: width,
			height: height,
			cx: x + width/2,
			cy: y + height/2,
			corners: [
				// 左上（基点）
				{
					x: x,
					y: y
				},
				// 右上
				{
					x: x + width,
					y: y
				},
				// 右下（終点）
				{
					x: x + width,
					y: y + height
				},
				// 左下
				{
					x: x,
					y: y + height
				}
			]
		}
	}
});
new OekakiView();
