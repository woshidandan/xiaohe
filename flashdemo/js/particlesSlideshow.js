/*
 * Copyright MIT © <2013> <Francesco Trillini>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 
var self = window;
 
;(function(self) {
		
	var canvas,
		context, 
		particles = [], 
		text = [], 
		nextText = [], 
		shape = {}, 
		mouse = { x: -99999, y: -99999 }, 
		currentTransition = 'circle', 
		left, right, 
		layout = 0, 
		type = ['circle', 'ovals', 'drop', 'ribbon'], 
		FPS = 60,
		
		/*
		 * List words.
		 */
		
		words = [ 'interest', 'show', 'theory', 'do it' ],
		
		/*
		 * List colors.
		 */
		
		colors = {
			circle: [ '#e67e22', '#2c3e50' ],
			ovals: [ '#c0392b', '#ff7e15' ],
			drop: [ '#1d75cf', '#3a5945' ],
			ribbon: [ '#702744', '#f98d00' ]
		};
	
	/*
 	 * Init.
	 */
	
	function init() {
		
		var slideshowContainer = document.querySelector('.ip-slideshow');
		
		canvas = document.createElement('canvas');
					
        canvas.width = innerWidth;
		canvas.height = 500;
		
        slideshowContainer.appendChild(canvas);

		// Browser supports canvas?
		if(!!(capable)) {
		
			context = canvas.getContext('2d');
		
			// Events
			if('ontouchmove' in window) {
				canvas.addEventListener('touchup', onTouchUp, false);
				canvas.addEventListener('touchmove', onTouchMove, false);	
			}
			else {
				canvas.addEventListener('mousemove', onMouseMove, false);
			}
			
			// Arrows
			handleClick('bind', 'left');
			handleClick('bind', 'right');
			
			window.onresize = onResize;
			
			createParticles();

			// Arrows elements
			left = document.querySelector('.ip-nav-left');
			right = document.querySelector('.ip-nav-right');

			// Show right arrow
			right.classList.add('ip-nav-show');
		
		}
		else {
			console.error('Sorry, switch to a better browser to see this experiment.');
		}
        
	}
	
	/*
	 * Checks if browser supports canvas element.
	 */
	
	function capable() {
		return canvas.getContext && canvas.getContext('2d');
	}
	
	/*
	 * On resize window event.
	 */
	
	function onResize() {
	
		canvas.width = window.innerWidth;
		canvas.height = 500;
		
		// Reset the text particles, and align again on the center of screen
		nextText = [];
		updateText();
					
	}
	
	function scrollX() {
		return window.pageXOffset || window.document.documentElement.scrollLeft; 
	}
	
	function scrollY() {
		return window.pageYOffset || window.document.documentElement.scrollTop;
	}

	/*
	 * Mouse move event.
	 */
	
	function onMouseMove(event) {
		event.preventDefault();		
		mouse.x = event.pageX - ( scrollX() + canvas.getBoundingClientRect().left );
		mouse.y = event.pageY - ( scrollY() + canvas.getBoundingClientRect().top );
	}
	
	/*
	 * Touch up event.
	 */
	
	function onTouchUp(event) {
		event.preventDefault();	
		// Reset mouse position
		mouse = { 
			x: -99999, 
			y: -99999 
		};
	}
	
	/*
	 * Touch move event.
	 */
	
	function onTouchMove(event) {
		event.preventDefault();	
		mouse.x = event.touches[0].pageX - ( scrollX() + canvas.getBoundingClientRect().left );
		mouse.y = event.touches[0].pageY - ( scrollY() + canvas.getBoundingClientRect().top );
	}
	
	/*
	 * Left click event.
	 */
	
	function onLeftClick(event) {
		
		event.preventDefault();
					
		currentTransition = type[Math.max(0, --layout)];
		
		// Reset towards points, and fill with new
		nextText = [];
		updateText();

		if(layout === 0) {
			left.classList.remove('ip-nav-show');	
			handleClick('unbind', 'left');
			return;
		}
		
		if(layout === type.length - 2) {
			right.classList.add('ip-nav-show');
			handleClick('bind', 'right');
		}
					
	}
	
	/*
	 * Right click event.
	 */
	
	function onRightClick(event) {
		
		event.preventDefault();
							
		currentTransition = type[Math.min(type.length, ++layout)];

		// Reset towards points, and fill with new
		nextText = [];
		updateText();
				
		if(layout === 1) {
			left.classList.add('ip-nav-show');
			handleClick('bind', 'left');
		}
		if(layout === type.length - 1) {	
			right.classList.contains('ip-nav-show') ? right.classList.remove('ip-nav-show') : null;
			handleClick('unbind', 'right');
		}
				
	}
	
	/*
	 * Handle click events for arrows.
	 */
	
	function handleClick(action, type) {
	
		var direction = type === 'left' ? onLeftClick : onRightClick;
	
		switch(action) {
		
			case 'bind':
			
				document.querySelector('.ip-nav-' + type).addEventListener('touchstart', direction, false);
				document.querySelector('.ip-nav-' + type).addEventListener('click', direction, false);
				document.querySelector('.ip-nav-' + type).style.cursor = 'pointer';
				break;
				
			case 'unbind':
			
				document.querySelector('.ip-nav-' + type).removeEventListener('touchstart', direction, false);
				document.querySelector('.ip-nav-' + type).removeEventListener('click', direction, false);
				document.querySelector('.ip-nav-' + type).style.cursor = 'default';
				break;
				
			default: break;
		
		}
	
	}
	
	/*
	 * Create particles.
	 */
	
	function createParticles() {
			
		for(var quantity = 0, len = 200; quantity < len; quantity++) {
				
			var x, y, steps, 
			
			steps = Math.PI * 2 * quantity / len;
			
			x = canvas.width * 0.5 + 10 * Math.cos(steps);
			y = 180 + 10 * Math.sin(steps);
			
			var radius = randomBetween(0, 12);
			var hasBorn = radius > 0 || radius < 12 ? false : true;
			
			var color = colors.circle[~~(Math.random() * colors.circle.length)];
			
			particles.push({
			
				x: x,
				y: y,
				
				hasBorn: hasBorn,
				
				ease: 0.04 + Math.random() * 0.06,
				bornSpeed: 0.07 + Math.random() * 0.07,
				
				alpha: 0,
				maxAlpha: 0.7 + Math.random() * 0.4,
				
				radius: radius,
				maxRadius: 12,
				
				color: color,
				interactive: false,
				
				angle: 0,
				
				steps: steps
				
			});
			
		}
		
		// Go!
		updateText();	
		loop();
	
	}
	
	/*
	 * Create text particles.
	 * @param seed.
	 */
	
	function createTextParticles(seed) {
		
		for(var quantity = 0, len = seed; quantity < len; quantity++) {
		
			var radius = randomBetween(0, 12);
			var hasBorn = radius > 0 || radius < 12 ? false : true;
			
			var color = colors.circle[~~(Math.random() * colors.circle.length)];
			
			text.push({
			
				x: canvas.width * 0.5,
				y: canvas.height - 70,
					
				hasBorn: hasBorn,
				
				ease: 0.04 + Math.random() * 0.06,
				bornSpeed: 0.07 + Math.random() * 0.07,
				
				alpha: 0,
				maxAlpha: 0.7 + Math.random() * 0.4,
				
				radius: radius,
				maxRadius: 12,
				
				color: color,
				interactive: false
												
			});
		
		}
	
	}
	
	/*
	 * Update the current text to a new one.
	 */
	
	function updateText() {
	
		// Clear immediately the screen
		clear();
		
		context.font = 100 + 'px Lato, Arial, sans-serif';
		context.fillStyle = 'rgb(255, 255, 255)';		
		context.textAlign = 'center';
		
		var strip = words[layout].toUpperCase().split('').join(String.fromCharCode(8202));
		
		context.fillText(strip, canvas.width * 0.5, canvas.height - 50);
			
		var surface = context.getImageData(0, 0, canvas.width, canvas.height);
				
		for(var width = 0; width < surface.width; width += 4) {
			
			for(var height = 0; height < surface.height; height += 4) {
				
				var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];
					
				// The pixel color is white? So draw on it...
				if(color === 255) {
							
					nextText.push({
						
						x: width,
						y: height,
						
						orbit: randomBetween(1, 3),
						angle: 0
							
					});
						
				}
					
			}
				
		}
			
		var seed = nextText.length;
		
		// Recreate text particles, based on this seed
		createTextParticles(seed);
		
	}
	
	/*
	 * Transitions handler.
	 */
	
	function updateTransition() {
				
		/* --- Shapes ---- */		
		[].forEach.call(particles, function(particle, index) { 
			
			switch(currentTransition) {
			
				case 'circle':
				
					shape.x = canvas.width * 0.5 + 140 * Math.sin(particle.steps);
					shape.y = 180 + 140 * Math.cos(particle.steps);
					
					break;
					
				case 'ovals':
					
					var limit, steps;
					
					limit = (particles.length * 0.5) - 1;
					steps = Math.PI * 2 * index / limit;
					
					// First oval
					if(index < [].slice.call(particles, 0, limit).length) {
				
						shape.x = canvas.width * 0.5 + 80 * Math.cos(steps);
						shape.y = 180 + 140 * Math.sin(steps);

					}
				
					// Second oval
					else {
						
						limit = (particles.length * 0.5);
						
						shape.x = canvas.width * 0.5 + 140 * Math.cos(steps);
						shape.y = 180 + 80 * Math.sin(steps);
						
					}
					
					break;
				
				case 'drop': 
				
					shape.x = canvas.width * 0.5 + 90 * (1 - Math.sin(index)) * Math.cos(index);
					shape.y = 320 + 140 * (- Math.sin(index) - 1);
					
					break;
					
				case 'ribbon':
				
					shape.x = canvas.width * 0.5 + 90 * (Math.sin(index)) * Math.cos(index);
					shape.y = 320 + 140 * (- Math.sin(index) - 1);
				
					break;
					
				default: break;
			
			}
			
			if(!particle.interactive) {
				
				particle.x += ((shape.x + Math.cos(particle.angle) * 5) - particle.x) * 0.08;
				particle.y += ((shape.y + Math.sin(particle.angle) * 5) - particle.y) * 0.08;
										
			}
				
			else {
					
				particle.x += ((mouse.x + Math.sin(particle.angle) * 30) - particle.x) * 0.08;
				particle.y += ((mouse.y + Math.cos(particle.angle) * 30) - particle.y) * 0.08;
									
			}
				
			particle.angle += 0.08;
		
		});
				
		/* --- Text ---- */
		[].forEach.call(nextText, function(particle, index) {
		
			if(!text[index].interactive) {
			
				text[index].x += ((particle.x + Math.cos(particle.angle + index) * particle.orbit) - text[index].x) * 0.08;
				text[index].y += ((particle.y + Math.sin(particle.angle + index) * particle.orbit) - text[index].y) * 0.08;

			}
			
			else {

				text[index].x += ((mouse.x + Math.sin(particle.angle) * 30) - text[index].x) * 0.08;
				text[index].y += ((mouse.y + Math.cos(particle.angle) * 30) - text[index].y) * 0.08;
			
			}
			
			particle.angle += 0.08;
		
		});
		
		// Remove extra particles
		if(nextText.length < text.length) {
		
			var extra = [].slice.call(text, nextText.length, text.length);
			
			// Remove extra text particles
			for(var index = 0; index < extra.length; index++)
			
				text.splice(index, 1);
				
		}
		
	}
	
	/*
	 * Loop logic.
	 */
	
	function loop() {
		clear();
		update();
		render();

		requestAnimFrame(loop);
	}
	
	/*
	 * Clear the whole screen.
	 */
	 
	function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	/*
	 * Update the particles.
	 */
	
	function update() {
		
		updateTransition();
		
		[].forEach.call(particles, function(particle, index) {
		
			particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;
				
			if(particle.hasBorn) {
			
				particle.radius += (0 - particle.radius) * particle.bornSpeed;
				
				if(Math.round(particle.radius) === 0) {
					
					// Color transition
					switch(currentTransition) {
					
						case 'circle':
						
							particle.color = colors.circle[~~(Math.random() * colors.circle.length)];
							
							break;
							
						case 'ovals':
						
							particle.color = colors.ovals[~~(Math.random() * colors.ovals.length)];
							
							break;
							
						case 'drop':
						
							particle.color = colors.drop[~~(Math.random() * colors.drop.length)];
							
							break;
							
						case 'ribbon':
						
							particle.color = colors.ribbon[~~(Math.random() * colors.ribbon.length)];
							
							break;
							
						case 'heart':
						
							particle.color = colors.heart[~~(Math.random() * colors.heart.length)];
							
							break;
						
						default: break;
					
					} 
					
					particle.hasBorn = false;
			
				}
				
			}
		
			if(!particle.hasBorn) {
			
				particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
						
				if(Math.round(particle.radius) === particle.maxRadius)
				
					particle.hasBorn = true;
				
			}
					
			distanceTo(mouse, particle) <= particle.radius + 30 ? particle.interactive = true : particle.interactive = false;
		
		});
		
		[].forEach.call(text, function(particle, index) {
		
			particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;
				
			if(particle.hasBorn) {
			
				particle.radius += (0 - particle.radius) * particle.bornSpeed;
				
				if(Math.round(particle.radius) === 0)
					
					particle.hasBorn = false;
				
			}
		
			if(!particle.hasBorn) {
			
				particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
						
				if(Math.round(particle.radius) === particle.maxRadius)
				
					particle.hasBorn = true;
				
			}
					
			distanceTo(mouse, particle) <= particle.radius + 30 ? particle.interactive = true : particle.interactive = false;
		
		});
		
	}
	
	/*
	 * Render the particles.
	 */
	
	function render() {
		
		[].forEach.call(particles, function(particle, index) {
		
			context.save();
			context.globalAlpha = particle.alpha;
			context.fillStyle = particle.color;
			context.beginPath();
			context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			context.fill();
			context.restore();
		
		});
		
		[].forEach.call(text, function(particle, index) {
		
			context.save();
			context.globalAlpha = particle.alpha;
			context.fillStyle = 'rgb(255, 255, 255)';
			context.beginPath();
			context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			context.fill();
			context.restore();
		
		});
		
	}
	
	/*
	 * Distance between two points.
	 */
	
	function distanceTo(pointA, pointB) {
		var dx = Math.abs(pointA.x - pointB.x);
		var dy = Math.abs(pointA.y - pointB.y);
		
		return Math.sqrt(dx * dx + dy * dy);
	}
	
	/*
	 * Useful function for random integer between [min, max].
	 */
	
	function randomBetween(min, max) {
		return ~~(Math.random() * (max - min + 1) + min);
	}
	
	/*
	 * Request new frame by Paul Irish.
	 * 60 FPS.
	 */
	
	window.requestAnimFrame = (function() {
	 
		return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
			  
				function(callback) {
			  
					window.setTimeout(callback, 1000 / FPS);
				
				};
			  
    })();

	window.addEventListener ? window.addEventListener('load', init, false) : window.onload = init;
	
})(self);