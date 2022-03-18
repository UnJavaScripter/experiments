import { Particle } from './particle.js';
import { QuadTree, Rect } from './quadtree.js';
import { Vector2d } from './vector2d.js';
class App {
    constructor() {
        this.gameOver = false;
        this.maxParticles = Math.ceil(window.innerWidth * 0.08);
        this.particles = new Set();
        this.massiveParticles = new Set();
        this.distanceThreshold = 100;
        this.canvasContainerElem = document.getElementById('canvas-container');
        this.canvasElem = document.getElementById('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.canvasElem.addEventListener('pointerdown', this.pointerDownListener.bind(this));
        // Fix resize quality degradation
        this.canvasElem.height = window.innerHeight;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentBoxSize) {
                    this.canvasElem.width = entry.contentRect.width;
                    this.canvasElem.height = Math.min(window.innerHeight, entry.contentRect.height);
                    this.stop();
                    this.init();
                }
            }
        });
        resizeObserver.observe(this.canvasContainerElem);
    }
    seed(n) {
        let x, y, particle;
        for (let i = 0; i < n; i++) {
            x = Math.ceil(Math.random() * this.canvasElem.width);
            y = Math.ceil(Math.random() * this.canvasElem.height);
            particle = new Particle(this.ctx, x, y, Math.ceil(Math.random() * 2.5));
            this.particles.add(particle);
        }
    }
    init() {
        if (!this.quadtree) {
            const canvasRect = new Rect(0, 0, this.canvasElem.width, this.canvasElem.height);
            this.quadtree = new QuadTree(canvasRect, 2500);
            this.seed(this.maxParticles);
            this.massiveParticles.add(new Particle(this.ctx, this.canvasElem.width - (Math.random() * this.canvasElem.width / 6), (Math.random() * 10), 3, 'cornflowerblue', true));
        }
        const gameLoop = () => {
            this.quadtree.clear();
            this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
            if (this.particles.size < this.maxParticles) {
                this.seed(this.maxParticles - this.particles.size);
            }
            for (let particle of this.particles) {
                if (particle.isOffViewport()) {
                    this.particles.delete(particle);
                }
                else {
                    this.quadtree.insert({ x: particle.pos.x, y: particle.pos.y, item: particle });
                    // particle.applyForce(new Vector2d(-0.0001, -0.0001))
                    particle.update();
                }
            }
            let nearbyParticlePoints;
            for (let massiveParticle of this.massiveParticles) {
                if (massiveParticle.isOffViewport()) {
                    this.massiveParticles.delete(massiveParticle);
                }
                else {
                    nearbyParticlePoints = this.quadtree.query(new Rect(massiveParticle.pos.x, massiveParticle.pos.y, this.distanceThreshold, this.distanceThreshold));
                    if (nearbyParticlePoints.length) {
                        let nearbyParticle;
                        for (let nearby of nearbyParticlePoints) {
                            nearbyParticle = nearby.item;
                            massiveParticle.influence(nearbyParticle, this.distanceThreshold);
                        }
                    }
                    massiveParticle.applyForce(new Vector2d(-0.003, 0.002));
                    massiveParticle.update();
                }
            }
            if (this.gameOver) {
                cancelAnimationFrame(this.raf);
            }
            else {
                this.raf = requestAnimationFrame(gameLoop);
            }
        };
        this.raf = requestAnimationFrame(gameLoop);
    }
    pointerDownListener(e) {
        const particle = new Particle(this.ctx, e.x, e.y, 3, undefined, true);
        this.massiveParticles.add(particle);
    }
    stop() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
            cancelAnimationFrame(this.raf);
        }
    }
    clearOffViewport(particlesArr, particleId) {
        particlesArr = [...particlesArr.splice(particleId, 1)];
    }
}
new App();
