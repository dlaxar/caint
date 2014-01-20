'use strict';

define(function() {

	var Drawable = function Drawable() {
		// a drawable object could theoretically be in multiple canvases
		this._caints = [];
	};

	Drawable.prototype.addTo = function(caint) {
		// caint is a Drawable itself (LocalSystem)
		if(caint instanceof Drawable) {
			caint.addDrawable(this);
			this._caints.push(caint);
		}
		else {
			caint.getDefaultLayer().addDrawable(this);
			this._caints.push(caint);
		}

		return this;
	};

	Drawable.prototype.removeFrom = function(caint) {
		caint.getDefaultLayer().removeDrawable(this);

		// remove canvas
		this._caints.splice(this._caints.indexOf(caint), 1);
	}

	Drawable.prototype.at = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Drawable.prototype.getPosition = function() {
		return {
			x: this.x,
			y: this.y
		};
	};

	Drawable.prototype.setupContext = function(ctx) {
		ctx.fillStyle = this.fillStyle;
		ctx.strokeStyle = this.strokeStyle;
	};

	/**
	 * Paints the shape
	 *
	 * @param {CanvasRenderingContext2D} ctx Context to draw on
	 */
	Drawable.prototype.paint = function(ctx) {
		throw new Error('need to override paint method in drawable');
	};

	Drawable.prototype.invalidate = function(modifiedProperty) {
		this._caints.forEach(function invalidateAll(caint) {
			// eg if it's a LocalSystem
			if(caint instanceof Drawable) {
				// recursion!
				caint._caints.forEach(invalidateAll);
			}

			caint.invalidate(this, modifiedProperty);
		});
	}

	/**
	 * Enables watch mode on a Class
	 *
	 * By defining getters and setters for all default values and calling
	 * Drawable.invalidate upon update watching is enabled.
	 *
	 * @param Class the class that will be watched
	 * @param {Object} defaults needs to contain all keys to watch on
	 * @returns {*} Class
	 * @private
	 */
	Drawable._watch = function(Class, defaults) {
		var defaultKeys = Object.keys(defaults);
		for(var i = 0; i < defaultKeys.length; i++) {
			Object.defineProperty(Class.prototype, defaultKeys[i], {
				enumerable: true,
				get: (function getterFactory(prop) {
					return function getter() {
						return this['_' + prop] || defaults[prop];
					}
				})(defaultKeys[i]),

				set: (function setterFactory(prop) {
					return function setter(value) {
						this['_' + prop] = value;
						this.invalidate();
					};
				})(defaultKeys[i])

			});
		}

		return Class;
	}

	return Drawable;

});