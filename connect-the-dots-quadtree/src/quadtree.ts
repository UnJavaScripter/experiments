class Item<T> {
  x: number
  y: number
  item: T

  constructor(x: number, y: number, item: T) {
    this.x = x
    this.y = y
    this.item = item
  }
}

class Point2d {
  x: number
  y: number
}

export class Rect {
  x: number
  y: number
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  contains(item: Point2d) {
    return (item.x >= this.x - this.width &&
      item.x < this.x + this.width &&
      item.y >= this.y - this.height &&
      item.y < this.y + this.height)
  }

  intersects(range: Rect) {
    return !(range.x - range.width > this.x + this.width ||
      range.x + range.width < this.x - this.width ||
      range.y - range.height > this.y + this.height ||
      range.y + range.height < this.y - this.height)
  }
}

export class QuadTree<T> {
  boundary: Rect
  capacity: number
  items: Item<T>[]
  isSplit: boolean

  topRight: QuadTree<T>
  topLeft: QuadTree<T>
  bottomRight: QuadTree<T>
  bottomLeft: QuadTree<T>


  constructor(boundary: Rect, maxCapacity: number) {
    this.boundary = boundary
    this.capacity = maxCapacity
    this.items = []
    this.isSplit = false
  }

  split() {
    const x = this.boundary.x
    const y = this.boundary.y
    const midWidth = this.boundary.width / 2
    const midHeight = this.boundary.height / 2

    const sectionTopRight = new Rect(x + midWidth, y - midHeight, midWidth, midHeight)
    const sectionTopLeft = new Rect(x - midWidth, y - midHeight, midWidth, midHeight)
    const sectionBottomRight = new Rect(x + midWidth, y + midHeight, midWidth, midHeight)
    const sectionBottomLeft = new Rect(x - midWidth, y + midHeight, midWidth, midHeight)

    this.topRight = new QuadTree(sectionTopRight, this.capacity)
    this.topLeft = new QuadTree(sectionTopLeft, this.capacity)
    this.bottomRight = new QuadTree(sectionBottomRight, this.capacity)
    this.bottomLeft = new QuadTree(sectionBottomLeft, this.capacity)

    this.isSplit = true
  }

  insert(item: Item<T>) {
    if (!this.boundary.contains(<Point2d>{ x: item.x, y: item.y })) {
      return false
    }

    if (this.items.length < this.capacity) {
      this.items.push(item)
      return true
    } else {
      if (!this.isSplit) {
        this.split()
      }

      if (this.topLeft.insert(item)) {
        return true
      } else if (this.topRight.insert(item)) {
        return true
      } else if (this.bottomRight.insert(item)) {
        return true
      } else if (this.bottomLeft.insert(item)) {
        return true
      }
    }
  }

  query(range: Rect, matches?: any[]): any[] {
    if (!matches) {
      matches = []
    }

    if (!this.boundary.intersects(range)) {
      return []
    } else {
      for (let item of this.items) {
        if (range.contains(item)) {
          matches.push(item)
        }
      }
      if (this.isSplit) {
        this.topLeft.query(range, matches)
        this.topRight.query(range, matches)
        this.bottomRight.query(range, matches)
        this.bottomLeft.query(range, matches)
      }
    }
    return matches
  }

  clear() {
    this.items = []
  }
}
