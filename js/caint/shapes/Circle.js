define(['./drawable', '../../utils/inherits'], function(Drawable, inherits) {

	var Circle = function Circle() {
		Circle.super_.apply(this);
	};

	Circle.prototype.paint = 1;

	inherits(Circle, Drawable);
	return Circle;

});