// The Day obj.
// Helper vars and functions.
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}
	var Day=function(options) {
		this.options = extend({}, this.options);
		extend(this.options, options);
		this.number = this.options.number;
		this.color = this.options.color;
		this.previewTitle = this.options.previewTitle;
		this.isActive = !this.options.inactive;
		this._layout();
	}

	Day.prototype.options = {
		number: 0,
		color: '#f1f1f1',
		previewTitle: '',
		inactive: false,
	};

	// Build the 3D cube element.
	Day.prototype._layout = function() {
		/* The Cube structure:
		<div class="cube">
			<div class="cube__side cube__side--front"></div>
			<div class="cube__side cube__side--back"></div>
			<div class="cube__side cube__side--right"></div>
			<div class="cube__side cube__side--left"></div>
			<div class="cube__side cube__side--top"></div>
			<div class="cube__side cube__side--bottom"></div>
		</div>
		*/
		this.cube = document.createElement('div');
		this.cube.className = this.isActive ? 'cube' : 'cube cubeInactive';
		this.cube.innerHTML = '<div class="cube__side cube__side--back"></div><div class="cube__side cube__side--left"></div><div class="cube__side cube__side--right"></div><div class="cube__side cube__side--bottom"></div><div class="cube__side cube__side--top"></div><div class="cube__side cube__side--front"><div class="cube__number">' + (this.number+1) + '</div></div>';
		this.currentTransform = {translateZ: 0, rotateX: 0, rotateY: 0};
	};

	Day.prototype._rotate = function(ev) {
		anime.remove(this.cube);

		var dir = this._getDirection(ev),
			type = ev.type.toLowerCase() === 'mouseenter' ? 1 : -1,
			animationSettings = {
				targets: this.cube,
				duration: 500,
				easing: 'easeOutQuart',
				translateZ: type === 1 ? 100 : 0
			};

		switch(dir) {
			case 0 : // from/to top
				animationSettings.rotateX = type === 1 ? -180 : 0; 
				animationSettings.rotateY = 0;
				break; 
			case 1 : // from/to right
				animationSettings.rotateY = type === 1 ? -180 : 0; 
				animationSettings.rotateX = 0;
				break; 
			case 2 : // from/to bottom
				animationSettings.rotateX = type === 1 ? 180 : 0; 
				animationSettings.rotateY = 0;
				break; 
			case 3 : // from/to left
				animationSettings.rotateY = type === 1 ? 180 : 0; 
				animationSettings.rotateX = 0;
				break;
		};

		this.currentTransform = {
			translateZ: animationSettings.translateZ, 
			rotateX: animationSettings.rotateX, 
			rotateY: animationSettings.rotateY
		};

		anime(animationSettings);
	};

	Day.prototype._setContentTitleFx = function(contentTitleEl) {
		this.titlefx = new TextFx(contentTitleEl);
		this.titlefxSettings = {
			in: {
				duration: 300,
				delay: function(el, index) { return 900 + index*20; },
				easing: 'easeOutExpo',
				opacity: {
					duration: 200,
					value: [0,1],
					easing:'linear'
				},
				rotateZ: function(el, index) { return [anime.random(-10,10), 0]; },
				translateY: function(el, index) {
					return [anime.random(-200,-100),0];
				}
			},
			out: {
				duration: 300,
				delay: 0,
				easing: 'easeInExpo',
				opacity: 0,
				translateY: -150
			}
		};
	};

	// From: https://codepen.io/noeldelgado/pen/pGwFx?editors=0110 by Noel Delgado (@noeldelgado).
	Day.prototype._getDirection = function(ev) {
		var obj = this.cube.querySelector('.cube__side--front'),
			w = obj.offsetWidth, 
			h = obj.offsetHeight,
			bcr = obj.getBoundingClientRect(),
			x = (ev.pageX - (bcr.left + window.pageXOffset) - (w / 2) * (w > h ? (h / w) : 1)),
			y = (ev.pageY - (bcr.top + window.pageYOffset) - (h / 2) * (h > w ? (w / h) : 1)),
			d = Math.round( Math.atan2(y, x) / 1.57079633 + 5 ) % 4;

		return d;
	};
	
