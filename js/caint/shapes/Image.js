'use strict';

define(['./drawable', '../../utils/inherits'], function(Drawable, inherits) {

	var defaults = {
		src: '',
		width: 0,
		height: 0
	}

	var Image = function Image() {
		Image.super_.apply(this);
	};

	inherits(Image, Drawable);

	Image.prototype.paint = function(ctx) {
		if(!this.src) {
			return;
		}

		if(!this._img) {
			this._img = document.createElement('img');
			this._img.setAttribute('src', this.src);
		}

		var pos = this.getPosition();
		var scale = this.scale || 1;
		var width = (this.width || this._img.width) * scale;
		var height = (this.height || this._img.height) * scale;
		ctx.drawImage(this._img, pos.x, pos.y, width, height);
	};

	Drawable._watch(Image, defaults);

	return Image;
});