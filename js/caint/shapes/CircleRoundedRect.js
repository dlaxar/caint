'use strict';

define(['./drawable', '../../utils/inherits'], function(Drawable, inherits) {

	var defaults = {
		fillStyle: 'black',
		width: 0,
		height: 0,
		borderRadius: 0,
		strokeStyle: ''
	}


	var CircleRoundedRect = function CircleRoundedRect() {
		CircleRoundedRect.super_.apply(this);
	};

	inherits(CircleRoundedRect, Drawable);

	CircleRoundedRect.prototype.paint = function(ctx) {
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

		ctx.arc(x + width - radius, y + radius, radius, 1.5*Math.PI, 0);


		ctx.lineTo(x + width, y + height - radius);

		ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5*Math.PI);


		ctx.lineTo(x + radius, y + height);

		ctx.arc(x + radius, y + height - radius, radius, 0.5*Math.PI, Math.PI);

		ctx.lineTo(x, y + radius);

		ctx.arc(x + radius, y + radius, radius, Math.PI, 1.5*Math.PI);

		ctx.closePath();

		ctx.fill();
	};

	Drawable._watch(CircleRoundedRect, defaults);

	return CircleRoundedRect;
});