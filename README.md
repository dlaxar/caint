# caint
making canvas suck less since 2014

## dependencies
**caint** depends on [require.js](http://requirejs.org) for all it's modules.

## philosophy

* A framework for frameworkless canvas (I know...)
* 3 repaint modes:
 * requestAnimationFrame: render at 60fps
 * manual: call ```caint.paint()``` manually
 * watch: watch for changes on objects (e.g. ```rect.fillStyle = 'black'```) and repaint (*really* not recommended for animations)
* Provide a prototype ```Drawable``` that is inherited by all Objects
* Provide Layers and basic shapes, let users implement their own complex shapes
* make **everything** chainable

## usage

```javascript
// use require js
require(['js/caint/caint.js', 'js/caint/shapes/Rect'], function(Caint, Rect) {

	// initialize caint
    var caint = new Caint({width: 1000, height: 1000});
    var rect = new Rect();
    rect.width = 200;
    rect.height = 200;
    rect.fillStyle = 'white';

    // adds a white rectangle to your canvas
    rect.addTo(caint).at(100, 100);

    // add to DOM
    caint.appendTo(document.getElementById('myid') /*psssst! you could also pass a jQ object*/);
    caint.paint();
});
```

## plugins
### FX
```javascript
require(['js/caint/caint.js', 'js/caint/shapes/Rect', 'js/caint/plugins/FX'],
	function(Caint, Rect, FX) {

	// this patches all objects it needs to patch
	FX();


    // ... do caint initialization here
	var caint = Caint({/*...*/});

	var rect = new Rect();

    // ... now set up your rect

    // and tween
    rect.tween('x').from(0).to(100).in(1, 's').using('easein').now();

    // requestAnimationFrame
    caint.setRepaintMode(caint.REPAINT_MODE_RAF);
});
```


## contributing
Feel free to develop and create PR's whenever you like. Any kind of help is welcome.

## license
MIT. You know the rest.

In case you don't know the rest: [The MIT License](http://opensource.org/licenses/MIT)

tl;dr: use it but only to create awesome stuff.

*Have fun,
Sincerely,
@dlaxar*