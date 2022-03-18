export class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
export class Quadtree {
    // ctx: CanvasRenderingContext2D
    constructor(bounds, maxItems = 10, maxLevels = 4, level = 0) {
        // this.ctx = ctx
        this.bounds = bounds;
        this.maxItems = maxItems;
        this.maxLevels = maxLevels;
        this.level = level;
        this.items = [];
        this.nodes = [];
    }
    split() {
        const newLevel = this.level + 1;
        const halfWidth = this.bounds.width / 2;
        const halfHeight = this.bounds.height / 2;
        // top right
        const bounds_tr = new Rect(this.bounds.x + halfWidth, this.bounds.y, halfWidth, halfHeight);
        this.nodes[0] = new Quadtree(bounds_tr, this.maxItems, this.maxLevels, newLevel);
        // top left
        const bounds_tl = new Rect(this.bounds.x, this.bounds.y, halfWidth, halfHeight);
        this.nodes[1] = new Quadtree(bounds_tl, this.maxItems, this.maxLevels, newLevel);
        // bottom left
        const bounds_bl = new Rect(this.bounds.x, this.bounds.y + halfHeight, halfWidth, halfHeight);
        this.nodes[2] = new Quadtree(bounds_bl, this.maxItems, this.maxLevels, newLevel);
        // bottom left
        const bounds_br = new Rect(this.bounds.x + halfWidth, this.bounds.y + halfHeight, halfWidth, halfHeight);
        this.nodes[3] = new Quadtree(bounds_br, this.maxItems, this.maxLevels, newLevel);
    }
    getNodesIndex(searchBounds) {
        const nodesIndexArr = [];
        const midPointX = this.bounds.x + this.bounds.width / 2;
        const midPointY = this.bounds.y + this.bounds.height / 2;
        const startsTop = searchBounds.y < midPointY;
        const startsLeft = searchBounds.x < midPointX;
        const endsRight = searchBounds.x + searchBounds.width > midPointX;
        const endsBottom = searchBounds.y + searchBounds.height > midPointY;
        // this.ctx.strokeStyle = 'red'
        // this.ctx.rect(searchBounds.x, searchBounds.y, searchBounds.width / 2, searchBounds.height/ 2)
        if (startsTop && endsRight) {
            nodesIndexArr.push(0);
        }
        if (startsTop && startsLeft) {
            nodesIndexArr.push(1);
        }
        if (endsBottom && startsLeft) {
            nodesIndexArr.push(2);
        }
        if (endsBottom && endsRight) {
            nodesIndexArr.push(3);
        }
        return nodesIndexArr;
    }
    get(searchBounds) {
        const nodesIndexArr = this.getNodesIndex(searchBounds);
        let items = this.items;
        // this.ctx.strokeStyle = 'green'
        // this.ctx.rect(searchBounds.x, searchBounds.y, searchBounds.width / 2, searchBounds.height/ 2)
        // this.ctx.stroke()
        if (this.nodes.length) {
            for (let i = 0; i < nodesIndexArr.length; i++) {
                items = [...this.items, ...this.nodes[nodesIndexArr[i]].get(searchBounds)];
            }
        }
        return [...new Set(items)];
    }
    add(particle, width, height) {
        let indexes;
        // console.log('adding', searchBounds)
        const searchBounds = new Rect(particle.pos.x, particle.pos.y, width, height);
        if (this.nodes.length) {
            indexes = this.getNodesIndex(searchBounds);
            for (let i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].add(particle, width, height);
            }
            return;
        }
        this.items.push(particle);
        if (this.items.length > this.maxItems && this.level < this.maxLevels) {
            if (!this.nodes.length) {
                this.split();
            }
            let particleBounds;
            for (let i = 0; i < this.items.length; i++) {
                particleBounds = new Rect(this.items[i].pos.x, this.items[i].pos.y, width, height);
                indexes = this.getNodesIndex(particleBounds);
                for (let j = 0; j < indexes.length; j++) {
                    this.nodes[indexes[j]].add(this.items[i], width, height);
                }
            }
            this.items = [];
        }
    }
    clear() {
        if (this.items.length) {
            this.items = [];
        }
        if (this.nodes.length) {
            this.nodes = [];
        }
    }
}
