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
		}
		this.drawMode = "";
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

		if(this.drawMode === "move")
		{
			// 矩形の移動時は、移動前の矩形の基点x,y座標に移動距離をプラスして
			// 新たな矩形の基点座標を導きだす
			basePointX = this.square.corners[0].x + distanceX;
			basePointY = this.square.corners[0].y + distanceY;
			
			// 移動前のマウスx,y座標をキャッシュ（クリック時の座標ではない）
			this.startX = currentX;
			this.startY = currentY;

			// 移動時は矩形のwidthとheightは変わらない
			width = this.square.width;
			height = this.square.height;
		}
		else
		{
			// 矩形の基点座標はマウスのクリック座標と同じ
			basePointX = this.startX;
			basePointY = this.startY;

			// 矩形のwidthはマウスの移動距離
			// 矩形のheightはwidth×縦横比率
			width = distanceX;
			height = width/this.ratio;
		}

		// 矩形を描画
		this.render(basePointX, basePointY, width, height);
		
		// 矩形の終点座標（矩形右下）を取得する
		endPointX = basePointX + width;
		endPointY = basePointY + height;

		// もしも終点座標が、基点座標よりも小さい場合
		// マウスをクリック座標から左上に移動したことになるので
		// 基点座標と終点座標を逆転させる必要がある
		// また、widthとheightを正数にする必要がある
		if(endPointX < basePointX && endPointY < basePointY)
		{
			var _basePointX = basePointX;
			var _basePointY = basePointY;
			
			basePointX = endPointX;
			basePointY = endPointY;
			
			endPointX = _basePointX;
			endPointY = _basePointY;
			
			width = Math.abs(width);
			height = Math.abs(height);
		}
		
		// 矩形の幅、高さと四隅の座標を格納
		this.square = {
			width: width,
			height: height,
			corners: [
				// 左上（基点）
				{
					x: basePointX,
					y: basePointY
				},
				// 右上
				{
					x: endPointX,
					y: basePointY
				},
				// 右下（終点）
				{
					x: endPointX,
					y: endPointY
				},
				// 左下
				{
					x: basePointX,
					y: endPointY
				}
			]
		}
	},
	render: function(x, y, width, height) {
		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.lineWidth = this.lineWidth;

		// 以前の矩形が残っているので、一度canvasをクリアする
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		this.ctx.strokeRect(x, y, width, height);
	}
});
new OekakiView();
