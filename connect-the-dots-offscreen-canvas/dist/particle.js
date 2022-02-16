export class ParticleProps {
}
export class ParticleDirection {
}
export class ParticleVelocity {
}
export class Particle {
    constructor(ctx, props) {
        this.ctx = ctx;
        this.x = props.x;
        this.y = props.y;
        this.size = props.size;
        this.color = props.color || 'azure';
        this.direction = props.direction || { x: 0, y: 1 };
        this.mass = props.mass || 10;
        this.master = props.master;
        this.landed = false;
        this.gravity = 9.8;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.opacity = 0;
        this.draw();
    }
    draw() {
        this.ctx.fillStyle = this.master ? `rgba(50, 55, 150, ${this.opacity})` : `rgba(40, 30, 80, ${this.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        if (this.opacity <= 1) {
            this.opacity += 0.005;
        }
    }
    update() {
        if (this.y + this.size > this.ctx.canvas.height || this.y <= 0 || this.x < 0) {
            this.landed = true;
        }
        else {
            this.x -= (this.direction.x * this.velocity.x) + 0.25;
            this.y += (this.mass * this.gravity) / 250;
        }
        this.draw();
    }
}
