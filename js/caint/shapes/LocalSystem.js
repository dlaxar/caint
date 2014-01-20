'use strict';

define(['./drawable', '../../utils/inherits'], function(Drawable, inherits) {

	var defaults = {
	}

	var LocalSystem = function LocalSystem() {
		LocalSystem.super_.apply(this);

		this.stack = [];
	};

	inherits(LocalSystem, Drawable);

	LocalSystem.prototype.addDrawable = function(drawable) {
		if(!(drawable instanceof Drawable)) {
			throw new Error('drawable has to be instance of Drawable');
		}

		this.stack.push(drawable);
	}

	LocalSystem.prototype.paint = function(ctx, caint) {
		var localPos = this.getPosition();
		var localX = localPos.x,
			localY = localPos.y;

		this.stack.forEach(function(element) {
			var pos = element.getPosition();
			element.at(pos.x + localX, pos.y + localY);
			element.paint(ctx, caint);
			element.at.call(element, pos.x, pos.y);
		});
	};

	Drawable._watch(LocalSystem, defaults);

	return LocalSystem;
});