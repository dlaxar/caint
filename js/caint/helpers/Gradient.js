define(function() {

	var Gradient = function(caint) {
		this.caint = caint; //g = caint.ctx.createLinearGradient(0, 0, caint.width, 0);
		this.stops = [];
	};

	Gradient.prototype.from = function(x0, y0) {
		if(arguments.length === 1 && typeof x0 === 'string') {
			var xy = this._splitPostitionString(x0);
			x0 = xy[0];
			y0 = xy[1];
		}

		this.x0 = x0;
		this.y0 = y0;

		return this;
	};

	Gradient.prototype.to = function(x1, y1) {
		if(arguments.length === 1 && typeof x1 === 'string') {
			var xy = this._splitPostitionString(x1);
			x1 = xy[0];
			y1 = xy[1];
		}

		this.x1 = x1;
		this.y1 = y1;

		return this;
	};

	/**
	 * Add a color stop
	 * @param pos either in percent (1 is max) or in px values from the width. any value below 1 will be considered to be in percent
	 * @param color
	 */
	Gradient.prototype.stop = function(pos, color) {
		if(typeof pos === 'number' && pos > 1) {
			pos /= this.caint.width;
			if(pos > 1) {
				throw new Error('invalid position');
			}
		}

		this.stops.push({
			position: pos,
			color: color
		});

		return this;
	}

	Gradient.prototype._splitPostitionString = function(string) {
		var args = string.split(' ');
		var x, y;

		if(args.length !== 2) {
			throw new Error('Please specify the position using \'x[space]y\'');
		}

		switch(args[0]) {
			case 'left':
				x = 0;
				break;
			case 'right':
				x = this.caint.width;
				break;
			case 'middle':
				x = this.caint.width/2;
				break;
			default:
				throw new Error('invalid X');
		}

		switch(args[1]) {
			case 'top':
				y = 0;
				break;
			case 'bottom':
				y = this.caint.height;
				break;
			case 'middle':
				y = this.caint.height/2;
				break;
			default:
				throw new Error('invalid Y');
		}

		return [x, y];
	};

	Gradient.prototype.build = function() {

		var g = this.caint.ctx.createLinearGradient(
			this.x0 || 0,
			this.y0 || 0,
			this.x1 || this.caint.width,
			this.y1 || this.caint.height);

		for(var i = 0; i < this.stops.length; i++) {
			g.addColorStop(this.stops[i].position, this.stops[i].color);
		}

		return g;
	}

	return Gradient;
});