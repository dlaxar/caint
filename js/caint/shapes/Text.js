'use strict';

define(['./drawable', '../../utils/inherits'], function(Drawable, inherits) {

	var defaults = {
		text: '',
		font: '',
		fillStyle: ''
	};

	var Text = function Text(text) {
		Text.super_.apply(this);
		this.text = text;
	};

	inherits(Text, Drawable);

	Text.prototype.paint = function(ctx) {
		this.setupContext(ctx);
		ctx.font = this.font;

		var pos = this.getPosition();

		ctx.fillText(this.text, pos.x, pos.y);

	};

	Drawable._watch(Text, defaults);

	return Text;
});