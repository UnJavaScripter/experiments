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
        this.landed = false;
        this.gravity = 9.8;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.draw();
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fill();
    }
    update() {
        if (this.y + this.height > this.ctx.canvas.height || this.y <= 0) {
            this.landed = true;
        }
        else {
            this.x += (this.direction.x * this.velocity.x);
            this.y += (this.mass * this.gravity) / 50;
            // this.ctx.font = '20px serif';
            // this.ctx.fillText(Math.round(Math.floor(this.mass)).toString(), this.x, this.y);
        }
        this.draw();
    }
}
//# sourceMappingURL=particle.js.map