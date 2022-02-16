let calcWorker;
calcWorker = new Worker('./dist/ui-worker.js', { type: "module" });
class App {
    constructor() {
        this.raf = 0;
        this.startTime = 0;
        this.gameOver = false;
        this.particles = [];
        this.canvasContainerElem = document.getElementById('canvas-container');
        this.canvasElem = document.getElementById('canvas');
        this.canvasElem.addEventListener('pointerdown', this.addNewDrop.bind(this));
        this.seedAmount = 200;
        this.maxParticles = Math.ceil(window.innerWidth * 0.5);
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.offscreen;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentBoxSize) {
                    if (this.w !== entry.contentRect.width || this.h !== entry.contentRect.height) {
                        this.w = entry.contentRect.width;
                        this.h = window.innerHeight;
                        this.canvasElem.height = this.h;
                        this.canvasElem.width = this.w;
                        this.stop();
                        this.init(this.w, this.h);
                    }
                }
            }
        });
        resizeObserver.observe(this.canvasContainerElem);
    }
    init(width, height) {
        // @ts-ignore
        this.offscreen = new OffscreenCanvas(width, height);
        calcWorker.postMessage({
            message: 'init',
            data: {
                maxParticles: this.maxParticles,
                seedAmount: this.seedAmount,
                width,
                height
            }
        });
        calcWorker.postMessage({ canvas: this.offscreen }, [this.offscreen]);
        const ctx = this.canvasElem.getContext("bitmaprenderer", { alpha: true });
        calcWorker.onmessage = function (e) {
            if (e.data.msg === 'render') {
                // @ts-ignore
                ctx.transferFromImageBitmap(e.data.bitmap);
            }
        };
    }
    stop() {
        if (calcWorker) {
            calcWorker.postMessage({ message: 'stop' });
        }
    }
    addNewDrop(e) {
        const bcr = this.canvasElem.getBoundingClientRect();
        const x = e.clientX - bcr.left;
        const y = e.clientY - bcr.top;
        const newMaster = {
            x: x,
            y: y,
            size: 3,
            mass: 20,
            master: true
        };
        calcWorker.postMessage({ message: 'add', data: newMaster });
    }
}
new App();
export {};
