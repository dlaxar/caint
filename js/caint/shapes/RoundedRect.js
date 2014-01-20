'use strict';

define(['./drawable', '../../utils/inherits'], function(Drawable, inherits) {

	var defaults = {
		fillStyle: 'black',
		width: 0,
		height: 0,
		borderRadius: 0,
		strokeStyle: ''
	}


	var RoundedRect = function RoundedRect() {
		RoundedRect.super_.apply(this);
	};

	inherits(RoundedRect, Drawable);

	RoundedRect.prototype.paint = function(ctx) {
		this.setupContext(ctx);
		var pos = this.getPosition();
		var x = pos.x;
		var y = pos.y;
		var width = this.width;
		var height = this.height;
		var radius = this.borderRadius || defaults.borderRadius;

		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();

//		ctx.stroke();
		ctx.fill();
	};

	Drawable._watch(RoundedRect, defaults);

	return RoundedRect;
});