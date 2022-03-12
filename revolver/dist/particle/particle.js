export class Particle {
    constructor(ctx, x, y, radius) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this._color = 'azure';
        this.draw();
    }
    set mass(mass) {
        this._mass = mass;
    }
    draw() {
        this.ctx.fillStyle = this._color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    move(targetX, targetY) {
        if (!this.targetX) {
            this.targetX = targetX;
        }
        if (!this.targetY) {
            this.targetY = targetY;
        }
        if (this.x !== this.targetX) {
            if (this.x < this.targetX) {
                this.x = this.x + 1;
            }
        }
        else {
            delete this.targetX;
        }
        if (this.y !== this.targetY) {
            if (this.y < this.targetY) {
                this.y = this.y + 1;
            }
        }
        else {
            delete this.targetY;
        }
        this.draw();
    }
}
