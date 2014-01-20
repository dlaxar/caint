'use strict';

define(['./Layer', './shapes/drawable'], function(Layer, Drawable) {

	/**
	 *
	 * @constructor
	 */
	var Caint = function(opts) {

		this.caint = {
			version: '0.0.1'
		};

		/**
		 * The stack represents the layer stack. Each layer has it's own stack
		 * @type {Array}
		 */
		var defaultLayer = new Layer(this);
		this.stack = [defaultLayer];

		// pop the options into properties
		if(opts) {
			var keys = Object.keys(opts);
			for(var i = 0; i < keys.length; i++) {
				this[keys[i]] = opts[keys[i]];
			}
		}

		// create the element
		/**
		 * Canvas Object
		 * @type {HTMLElement}
		 */
		this.canvas = document.createElement('canvas');

		if(this.width) {
			var width = document.createAttribute('width');
			width.value = this.width + 'px';
			this.canvas.setAttributeNode(width);
		}

		if(this.height) {
			var height = document.createAttribute('height');
			height.value = this.height + 'px';
			this.canvas.setAttributeNode(height);
		}

		/**
		 * Canvas Context
		 * @type {CanvasRenderingContext2D}
		 */
		this.ctx = this.canvas.getContext('2d');

		this.setRepaintMode(this.REPAINT_MODE_MANUAL);

		// enable chaining
		return this;
	};

	Caint.prototype.toElement = function toElement() {

		return this.canvas;
	};

	Caint.prototype.appendTo = function appendTo(element) {
		// element is jQ
		if(typeof element.append === 'function') {
			element.append(this.toElement());
		}
		// element is normal DOM node
		else {
			element.appendChild(this.toElement());
		}
	};

	Caint.prototype.getDefaultLayer = function() {
		return this.stack[0];
	};

	Caint.prototype.addLayer = function(at, layer) {
		if(at instanceof Layer) {
			this.stack.push(at);
		}
		else if(typeof at === 'number') {
			this.stack.splice(at, 0, layer || new Layer);
		}

		return this;
	}

	Caint.prototype.paint = function() {
		if(this.background) {
			if(this.background instanceof Drawable) {
				this.background.paint(this.ctx);
			}
			else if(typeof this.background === 'string') {
				this.ctx.fillStyle = this.background;
				this.ctx.fillRect(0, 0, this.width, this.height);
			}
		}
		this.stack.forEach(function(item, index) {
			item.paint();
		});
	};

	Object.defineProperties(Caint.prototype, {
		'REPAINT_MODE_WATCH': {
			enumerable: false,
			configurable: false,
			writable: false,
			value: 'WATCH'
		},

		'REPAINT_MODE_MANUAL': {
			enumerable: false,
			configurable: false,
			writable: false,
			value: 'MANUAL'
		},

		'REPAINT_MODE_RAF': {
			enumerable: false,
			configurable: false,
			writable: false,
			value: 'RAF'
		}
	});

	Caint.prototype.setRepaintMode = function(mode) {
		this._repaintMode = mode;

		// cancel any requestAnimationFrame's
		if(this._rafRequestID) {
			window.cancelAnimationFrame(this._rafRequestID);
		}

		switch (mode) {
			case this.REPAINT_MODE_MANUAL:
				break;
			case this.REPAINT_MODE_WATCH:
				break;
			case this.REPAINT_MODE_RAF:
				this.onRAF();
				break;
			default:
				throw new Error('Mode ' + mode + ' is not supported');
		};
	};

	/**
	 * Invalidates the whole canvas and repaints everything
	 *
	 * @param drawable
	 * @param modifiedProperty
	 */
	Caint.prototype.invalidate = function(drawable, modifiedProperty) {
		if(this._repaintMode === this.REPAINT_MODE_WATCH) {
			this.paint();
		}
	};

	Caint.prototype.onRAF = function() {
		this.paint();
		this._rafRequestID = window.requestAnimationFrame(this.onRAF.bind(this));
	};


	return Caint;
});