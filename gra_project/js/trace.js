var TWO_PI = Math.PI * 2;
var HALF_PI = Math.PI * 0.5;
var THICKNESS = 12;
var LENGTH = 10;
var STEP = 0.1;
var FPS = 1000 / 60;

function Particle(x, y, mass) {

    this.x = x || 0;
    this.y = y || 0;
    this.ox = this.x;
    this.oy = this.y;
    this.mass = mass || 1.0;
    this.massInv = 1.0 / this.mass;
    this.fixed = false;

    this.update = function (dt) {
        if (!this.fixed) {
            var fx = 0.0000;
            var fy = 0.0000;
            var tx = this.x,
                ty = this.y;

            this.x += (this.x - this.ox) + fx * this.massInv * dt * dt;
            this.y += (this.y - this.oy) + fy * this.massInv * dt * dt;
            this.ox = tx;
            this.oy = ty;
        }
    };
};

function Spring(p1, p2, restLength, strength) {

    this.p1 = p1;
    this.p2 = p2;
    this.restLength = restLength || 10;
    this.strength = strength || 1.0;

    this.update = function (dt) {

        // Compute desired force
        var dx = p2.x - p1.x,
            dy = p2.y - p1.y,
            dd = Math.sqrt(dx * dx + dy * dy) + 0.0001,
            tf = (dd - this.restLength) / (dd * (p1.massInv + p2.massInv)) * this.strength,
            f;

        // Apply forces
        if (!p1.fixed) {
            f = tf * p1.massInv;
            p1.x += dx * f;
            p1.y += dy * f;
        }

        if (!p2.fixed) {
            f = -tf * p2.massInv;
            p2.x += dx * f;
            p2.y += dy * f;
        }
    }
};

function Sim() {

    this.particles = [];
    this.springs = [];

    this.tick = function (dt) {

        var i, n;

        for (i = 0, n = this.springs.length; i < n; ++i) {
            this.springs[i].update(dt);
        }

        for (i = 0, n = this.particles.length; i < n; ++i) {
            this.particles[i].update(dt);
        }
    }
};

// Create a new system
var sim = new Sim(),
    old = new Date().getTime(),
    canvas = document.getElementById('world'),
    context = canvas.getContext('2d');

function init() {

    var np,
    		op,
        mouse,
        anchor,
        step = STEP,
        length = LENGTH,
        count = length / step;

    var sx = canvas.width * 0.5;
    var sy = canvas.height * 0.5;

    for (var i = 0; i < count; ++i) {

        //np = new Particle(i*8,i*8,0.1+Math.random()*0.01);
        np = new Particle(sx + (Math.random() - 0.5) * 200, sy + (Math.random() - 0.5) * 200, 0.1 + Math.random() * 0.01);
        sim.particles.push(np);

        if (i > 0) {
            s = new Spring(np, op, step, 0.95);
            sim.springs.push(s);
        }

        op = np;
    }

    // Fix the first particle
    anchor = sim.particles[0];
    //anchor.fixed = true;
    anchor.x = 50;
    anchor.y = 50;

    // Move last particle with mouse
    mouse = sim.particles[count - 1];
    mouse.fixed = true;

    canvas.addEventListener('mousemove', function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });
};

function step() {

    var now = new Date().getTime(),
        delta = now - old;

    sim.tick(delta);

    // Clear canvas
    canvas.width = canvas.width;

    var points = []; // Midpoints
    var angles = []; // Delta angles

    var i, n, p1, p2, dx, dy, mx, my, sin, cos, theta;

    // Compute midpoints and angles
    for (i = 0, n = sim.particles.length - 1; i < n; ++i) {

        p1 = sim.particles[i];
        p2 = sim.particles[i + 1];

        dx = p2.x - p1.x;
        dy = p2.y - p1.y;

        mx = p1.x + dx * 0.5;
        my = p1.y + dy * 0.5;

        points[i] = {
            x: mx,
            y: my
        };
        angles[i] = Math.atan2(dy, dx);
    }

    // Render
    context.beginPath();

    for (i = 0, n = points.length; i < n; ++i) {

        p1 = sim.particles[i];
        p2 = points[i];

        theta = angles[i];

        r = Math.sin((i / n) * Math.PI) * THICKNESS;
        sin = Math.sin(theta - HALF_PI) * r;
        cos = Math.cos(theta - HALF_PI) * r;

        context.quadraticCurveTo(
        p1.x + cos,
        p1.y + sin,
        p2.x + cos,
        p2.y + sin);
    }

    for (i = points.length - 1; i >= 0; --i) {

        p1 = sim.particles[i + 1];
        p2 = points[i];

        theta = angles[i];

        r = Math.sin((i / n) * Math.PI) * THICKNESS;
        sin = Math.sin(theta + HALF_PI) * r;
        cos = Math.cos(theta + HALF_PI) * r;

        context.quadraticCurveTo(
        	p1.x + cos,
	        p1.y + sin,
  	      p2.x + cos,
    	    p2.y + sin);

    }

    context.strokeStyle = 'rgba(255,255,255,0.1)';
    context.lineWidth = 8;
    context.stroke();

    context.strokeStyle = 'rgba(0,0,0,0.8)';
    context.lineWidth = 0.5;
    context.stroke();

    context.fillStyle = 'rgba(255,255,255,0.9)';
    context.fill();

    old = now;

    setTimeout(step, FPS);
};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

init();
step();