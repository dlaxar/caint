'use strict';

define(['./../shapes/drawable', 'js/vendor/eventEmitter/EventEmitter', 'js/utils/inherits'], function(Drawable, EventEmitter, inherits) {

	var FPS = 60;

	var easings = {
		'linear': function(from, to, duration, now) {
			return from + ((to - from /* overall tweening distance*/)/duration /* per frame */) * now;
		},

		'easein': function(from, to, duration, now) {
			now /= duration;
			return (to - from /* change in value */) * now * now + from;
		},

		'easeout': function(from, to, duration, now) {
			now /= duration;
			return -(to - from /* change in value */) * now * (now-2) + from;
		},

		'easeinout': function(from, to, duration, now) {
			now /= duration/2;
			if(now < 1) return (to - from /* change in value */)/2 * now * now + from;

			now--;
			return -(to - from /* change in value */)/2 * (now * (now-2) - 1) + from;
		}
	}

	var Tween = function Tween(property, drawable) {
		this.property = property;
		this.drawable = drawable;
	};

	inherits(Tween, EventEmitter);

	Tween.prototype.from = function(from) {
		this._from = from;
		return this;
	};

	Tween.prototype.to = function(to) {
		this._to = to;
		return this;
	};

	Tween.prototype.using = function(calc) {
		if(typeof calc === 'string' && easings[calc.toLowerCase()]) {
			this._calc = easings[calc.toLowerCase()];
		} else if(typeof calc === 'function') {
			this._calc = calc;
		} else {
			throw new Error('Please provide a name of a supported easing function or an easing function');
		}
		return this;
	}

	Tween.prototype.in = function(time, unit) {
		var frames;

		switch(unit) {
			case 's':
				time *= 1000;
				break;
			case 'ms': break;
			case 'frames':
				frames = time;
				break;
			case undefined:
				time = 1000;
				break;
			default:
				throw new Error('Unit must either be \'s\', \'ms\' or \'frames\' when given');
		}

		if(!frames) {
			// time is in MS now

			frames = (time/1000) * 60;
		}

		this._frames = frames;
		return this;
	};

	Tween.prototype.now = function() {
		if(!this._to) {
			throw new Error('Need to know where to go. Please specify \'to\'');
		}

		var self = this;

		var prop = this.property;
		var obj = this.drawable;

		var easing = this._calc || easings['linear'];
		var from = (this._from || obj[prop]);
		var to = this._to;
		var duration = this._frames || 60;
		var now = 0;

		window.requestAnimationFrame(function raf() {
			obj[prop] = easing(from, to, duration, now);

			if(++now< duration) {
				window.requestAnimationFrame(raf);
			} else {
				self.emit('finish')
			}
		});
		return this;
	};

	var TweenGroup = function TweenGroup(properties, drawable) {
		TweenGroup.super_.call(this, properties, drawable);
	}

	inherits(TweenGroup, Tween);

	TweenGroup.prototype.now = function() {
		if(!this._to) {
			throw new Error('Need to know where to go. Please specify \'to\'');
		}

		var self = this;
		var props = this.property;
		var obj = this.drawable;

		var easing = this._calc || easings['linear'];

		var froms, tos;

		// from was given
		if(this._from) {
			// but is only one number
			if(typeof this._from === 'number') {
				// make an array with all the same number
				froms = [];
				for(var i = 0; i < props.length; i++) {
					froms.push(this._from);
				}
			}
			// given & is an array & is longer or equals as long as the props array
			else if(Array.isArray(this._from) && this._from.length >= props.length) {
				froms = this._from;
			}
			else {
				throw new Error('Cannot process froms');
			}
		} else {
			// not given, retrieve the values
			froms = [];
			for(var i = 0; i < props.length; i++) {
				froms[i] = obj[props[i]];
			}
		}

		// to is given but is only one number
		if(typeof this._to === 'number') {
			// make an array with all the same number
			tos = [];
			for(var i = 0; i < props.length; i++) {
				tos.push(this._to);
			}
		}
		// given & is an array & is longer or equals as long as the props array
		else if(Array.isArray(this._to) && this._to.length >= props.length) {
			tos = this._to;
		}
		else {
			throw new Error('Cannot process tos');
		}
		
		var duration = this._frames || 60;
		var now = 0;

		window.requestAnimationFrame(function raf() {

			for(var i = 0; i < props.length; i++) {
				obj[props[i]] = easing(froms[i], tos[i], duration, now);
			}

			if(++now< duration) {
				window.requestAnimationFrame(raf);
			} else {
				self.emit('finish')
			}
		});
		return this;
	}

	return function patch(OverrideDrawable) {
		var Class = OverrideDrawable || Drawable;

		Class.prototype.tween = function(property) {
			// tween group
			if(Array.isArray(property)) {
				return new TweenGroup(property, this);
			}
			else {
				return new Tween(property, this)
			}
		};
	};

});