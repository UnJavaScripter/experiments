import { Vector2d } from "./vector2d.js";
export class Particle extends Vector2d {
    constructor(ctx, x, y, mass, color = 'rebeccapurple', isMassive = false) {
        super(x, y);
        this._acc = new Vector2d(0, 0);
        this._velocity = new Vector2d(0, 0);
        this.isMassive = false;
        this.ctx = ctx;
        this.pos = new Vector2d(x, y);
        this._color = color;
        this.mass = mass;
        this.radius = Math.sqrt(this.mass) * 5;
        this.isMassive = isMassive;
        this.draw();
    }
    get mass() {
        return this._mass;
    }
    set mass(mass) {
        this._mass = mass;
    }
    get acc() {
        return this._acc;
    }
    set acc(acc) {
        this._acc = acc;
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(velocity) {
        this._velocity = velocity;
    }
    get color() {
        return this._color;
    }
    set color(color) {
        this._color = color;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    findEdges() {
        if (this.pos.x >= this.ctx.canvas.width - this.radius) {
            this.pos.x = this.ctx.canvas.width - this.radius;
            this.velocity.x *= -1;
        }
        else if (this.pos.x <= this.radius) {
            this.pos.x = this.radius;
            this.velocity.x *= -1;
        }
        if (this.pos.y >= this.ctx.canvas.height - this.radius) {
            this.pos.y = this.ctx.canvas.height - this.radius;
            this.velocity.y *= -1;
        }
        else if (this.pos.y <= this.radius) {
            this.pos.y = this.radius;
            this.velocity.y *= -1;
        }
    }
    applyForce(force) {
        const f = Vector2d.scalarDivide(force, this.mass);
        this.acc = Vector2d.add([this.acc, f]);
    }
    influence(particle) {
        const force = Vector2d.subtract([this.pos, particle.pos]);
        const distance = Vector2d.magnitudeSquared(force);
        const strength = ((this.mass * particle.mass) / distance) * 100;
        const gravitationalInfluenceForce = Vector2d.setMagnitude(force, strength);
        particle.applyForce(gravitationalInfluenceForce);
        // this.drawLine(this.pos, particle.pos, this.color, 4)
        // this.drawText("123", this.pos.x, this.pos.y)
    }
    update() {
        this.velocity =
            Vector2d.limit(Vector2d.add([
                this.velocity,
                Vector2d.limit(this.acc, 0.05)
            ]), 5);
        this.pos = Vector2d.add([
            this.pos,
            this.velocity,
        ]);
        this.acc = new Vector2d(0, 0);
        this.draw();
    }
    // UI helpers
    drawLine(origin, target, color = 'limegreen', lineDash) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.setLineDash(lineDash ? [lineDash] : []);
        this.ctx.moveTo(origin.x, origin.y);
        this.ctx.lineTo(target.x, target.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawText(label, x, y, size = 15, color = '#666') {
        this.ctx.font = `bold ${size}px system-ui`;
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = color;
        this.ctx.fillText(label, x, y);
    }
}
