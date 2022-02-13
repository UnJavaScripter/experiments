import { Particle } from './particle.js';
import { Tower } from './tower.js';
class App {
    constructor() {
        this.gameOver = false;
        this.particles = [];
        this.towers = [];
        this.towersAvailable = 5;
        this.towerEmoji = '🗿';
        this.creepEmoji = '🦠';
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('pointerdown', (e) => {
            if (this.gameOver) {
                this.init();
                this.gameOver = false;
            }
            else {
                if (this.towers.length < this.towersAvailable) {
                    this.towers.push(new Tower(this.ctx, {
                        x: e.x,
                        y: e.y,
                        width: 20,
                        height: 20,
                        color: '#1e90ff',
                        direction: { x: 0, y: 0 },
                        emoji: this.towerEmoji
                    }, 30, 700));
                }
            }
        });
        this.particlesAmount = 15;
        this.init();
    }
    init() {
        this.createSeed(this.particlesAmount);
        this.towers = [];
        let raf;
        const gameLoop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.setScore();
            this.displayTowersLeft();
            let particle;
            let tower;
            let distanceH;
            for (let i = 0; i < this.particles.length; i++) {
                particle = this.particles[i];
                particle.update();
                for (let j = 0; j < this.towers.length; j++) {
                    let shot;
                    tower = this.towers[j];
                    tower.update();
                    distanceH = this.getHypotenuse(particle, tower);
                    if (distanceH < 170) {
                        shot = tower.shoot(particle);
                        if (shot > 0) {
                            particle.hit(shot);
                            if (particle.health <= 0) {
                                this.particles.splice(i, 1);
                                if (this.particles.length === 0) {
                                    this.gameOver = true;
                                }
                            }
                        }
                    }
                }
            }
            if (this.gameOver) {
                this.playerWins();
                cancelAnimationFrame(raf);
            }
            else {
                raf = requestAnimationFrame(gameLoop);
            }
        };
        raf = requestAnimationFrame(gameLoop);
        this.startTime = performance.now();
    }
    getHypotenuse(particle1, particle2) {
        const distanceX = Math.abs(particle1.x - particle2.x);
        const distanceY = Math.abs(particle1.y - particle2.y);
        return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    }
    createSeed(seedAmount) {
        const n = 0;
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min || 1;
        }
        this.addElem(getRandomInt(1, this.canvas.width - 10), getRandomInt(1, this.canvas.height - 10), { x: 1, y: 1 });
        if (n < seedAmount - 1) {
            this.createSeed(seedAmount - 1);
        }
    }
    addElem(x, y, direction) {
        this.particles.push(new Particle(this.ctx, {
            x,
            y,
            width: 20,
            height: 20,
            color: 'pink',
            direction: direction || { x: 1, y: 1 },
            emoji: this.creepEmoji
        }));
    }
    displayTowersLeft() {
        this.ctx.font = '22px system-ui ';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#1e90ff';
        const towersLeft = this.towersAvailable - this.towers.length;
        const value = new Array(towersLeft);
        this.ctx.fillText(`[${value.fill('🗿').join(' - ')}]`, 2, 20, 280);
    }
    setScore() {
        this.ctx.font = '44px system-ui ';
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#ff9f43';
        this.ctx.fillText(`${this.particles.length}/${this.particlesAmount}`, this.canvas.width - 20, 50, 280);
    }
    playerWins() {
        console.log('win');
        this.ctx.font = '32px system-ui ';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#222f3e';
        this.ctx.fillRect(10, (window.innerHeight / 3) - 50, this.canvas.width - 20, 80);
        this.ctx.fillStyle = '#c8d6e5';
        this.ctx.fillText(`You did it! It took you ${Math.round((performance.now() - this.startTime) / 1000)}s and ${this.towers.length} ${this.towerEmoji || 'towers'}`, this.canvas.width / 2, window.innerHeight / 3);
    }
}
new App();
