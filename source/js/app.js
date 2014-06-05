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

		var defaultWidth = 100;
		var defaultHeight = defaultWidth/this.ratio;
		this.square = {
			width: defaultWidth,
			height: defaultHeight,
			corners:[
				{
					x: 50,
					y: 50
				},
				{
					x: 50 + defaultWidth,
					y: 50
				},
				{
					x: 50 + defaultWidth,
					y: 50 + defaultHeight
				},
				{
					x: 50,
					y: 50 + defaultHeight
				}
			]
		};

		// 矩形を描画
		this.render();
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
		console.log(this.drawMode);
		this.drawFlag = false;
	},
	mouseMoveHandler: function(e) {
		if (!this.drawFlag) return;

		var currentX, // マウス移動時のx座標
			currentY, // マウス移動時のy座標
			distanceX, // クリック時のマウスx座標からのx軸移動距離
			distanceY; // クリック時のマウスx座標からのy軸移動距離

		// マウス移動時のx,y座標を取得
		currentX = e.pageX - this.offsetX;
		currentY = e.pageY - this.offsetY;

		// マウス移動時のx,y座標とクリック時のx,y座標からマウス移動距離を取得
		distanceX = currentX - this.startX;
		distanceY = currentY - this.startY;

		// 移動前のマウスx,y座標をキャッシュ（クリック時の座標ではない）
		this.startX = currentX;
		this.startY = currentY;

		if(this.drawMode != "move")
		{
			if(Math.abs(distanceX) > Math.abs(distanceY))
			{
				distanceY = distanceX/this.ratio;
				if(this.drawMode === 2 || this.drawMode === 3)
				{
					distanceY = -distanceY;
				}
			}
			else
			{
				distanceX = distanceY*this.ratio;
				if(this.drawMode === 2 || this.drawMode === 3)
				{
					distanceX = -distanceX;
				}
			}
		}

		// 矩形の座標を更新
		this.updateCorners(distanceX, distanceY);

		// 矩形を描画
		this.render();
	},
	updateCorners: function(distanceX, distanceY) {
		// ローカル変数にクローンしておく
		var _corners = _.clone(this.square.corners, true);
		if(this.drawMode === "move")
		{
			// 矩形の移動時は、移動前の矩形の全ての四隅のx,y座標に移動距離をプラスして
			// 新たな矩形の基点座標を導きだす
			_.each(_corners, function(item, i) {
				item.x += distanceX;
				item.y += distanceY;
			});
		}
		else
		{
			switch(this.drawMode){
			case 1:
				_corners[0].x += distanceX;
				_corners[3].x += distanceX;
				_corners[0].y += distanceY;
				_corners[1].y += distanceY;
			break;
			case 2:
				_corners[1].x += distanceX;
				_corners[2].x += distanceX;
				_corners[1].y += distanceY;
				_corners[0].y += distanceY;
			break;
			case 3:
				_corners[3].x += distanceX;
				_corners[0].x += distanceX;
				_corners[3].y += distanceY;
				_corners[2].y += distanceY;
			break;
			case 4:
				_corners[2].x += distanceX;
				_corners[1].x += distanceX;
				_corners[2].y += distanceY;
				_corners[3].y += distanceY;
			break;
			}
		}

		if(!this.checkLimit(_corners)) return;
		// 制限内であれば値を更新する
		this.square.corners = $.extend(this.square.corners, _corners);
	},
	checkLimit: function(_corners) {
		var basePointX = _corners[0].x,
			basePointY = _corners[0].y,
			endPointX  = _corners[2].x,
			endPointY  = _corners[2].y,
			width      = endPointX - basePointX,
			height     = endPointY - basePointY;

		// 基点と終点がキャンバス内をはみ出さないように
		if((this.drawMode === 1 || this.drawMode === 3) && (basePointX <= 0 || basePointY <= 0)) return false;
		if((this.drawMode === 2 || this.drawMode === 4) && (endPointX  >= this.canvas.width || endPointY  >= this.canvas.height)) return false;
		if(this.drawMode === "move")
		{
			if(basePointX <= 0
			|| basePointY <= 0
			|| endPointX  >= this.canvas.width 
			|| endPointY  >= this.canvas.height
			)
			{
				return false;
			}
		}
		else
		{
			// minimumチェック
			if(width <= 50 && height <= 50/this.ratio) return false;
			
		}
		return true;
	},
	render: function() {
		var basePointX = this.square.corners[0].x;
		var basePointY = this.square.corners[0].y;
		var endPointX  = this.square.corners[2].x;
		var endPointY  = this.square.corners[2].y;
		var width      = endPointX - basePointX;
		var height     = endPointY - basePointY;

		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.lineWidth = this.lineWidth;

		// 以前の矩形が残っているので、一度canvasをクリアする
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.ctx.strokeRect(basePointX, basePointY, width, height);

		// 矩形の幅、高さと四隅の座標を格納
		var square = {
			width: width,
			height: height,
			cx: basePointX + width/2,
			cy: basePointY + height/2
		};
		this.square = $.extend(this.square, square);
	}
});
new OekakiView();
