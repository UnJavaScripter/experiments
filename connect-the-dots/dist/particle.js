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
        this.width = props.width;
        this.height = props.height;
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
        this.draw();
    }
    draw() {
        this.ctx.fillStyle = this.master ? 'rgb(110, 55, 160)' : this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fill();
    }
    update() {
        if (this.y + this.height > this.ctx.canvas.height || this.y <= 0 || this.x < 0) {
            this.landed = true;
        }
        else {
            this.x -= (this.direction.x * this.velocity.x) + 0.25;
            this.y += (this.mass * this.gravity) / 250;
        }
        this.draw();
    }
}
//# sourceMappingURL=particle.js.map