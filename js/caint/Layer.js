'use strict';

define(['./shapes/drawable', '../utils/inherits'], function(Drawable, inherits) {

	var Layer = function(caint) {
		this.caint = caint;
		this.stack = [];
	};

	inherits(Layer, Drawable);

	Layer.prototype.addDrawable = function(drawable) {
		if(!(drawable instanceof Drawable)) {
			throw new Error('drawable has to be instance of Drawable');
		}

		this.stack.push(drawable);
	};

	Layer.prototype.removeDrawable = function(drawable) {
		var index = this.stack.indexOf(drawable);
		if(index) {
			this.stack.splice(index, 1);
		}
	}

	Layer.prototype.paint = function() {
		var self = this;

		this.stack.forEach(function(item, index) {
			item.paint(self.caint.ctx, self.caint);
		});
	};

	return Layer;
});