export class Vector2d {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  static add(vectorsArr: Vector2d[]): Vector2d {
    let xComponent: Vector2d["x"] = 0
    let yComponent: Vector2d["y"] = 0

    for (let component of vectorsArr) {
      xComponent += component.x
      yComponent += component.y
    }

    return new Vector2d(xComponent, yComponent)
  }

  static subtract(vectorsArr: Vector2d[]): Vector2d {
    let xComponent: Vector2d["x"] | undefined = undefined
    let yComponent: Vector2d["y"] | undefined = undefined

    if (vectorsArr.length === 1) {
      return vectorsArr[0]
    } else if (!vectorsArr.length) {
      throw new Error('invalid vectors array length')
    }

    for (let component of vectorsArr) {
      if(xComponent === undefined) {
        xComponent = component.x
      } else {
        xComponent -= component.x
      }
     
      if(yComponent === undefined) {
        yComponent = component.y
      } else {
        yComponent -= component.y
      }
    }

    return new Vector2d(xComponent as number, yComponent as number)
  }

  static scalarMultiply(vector: Vector2d, scalar: number): Vector2d {
    return new Vector2d(vector.x * scalar, vector.y * scalar)
  }
  static scalarDivide(vector: Vector2d, scalar: number,): Vector2d {
    if (scalar === 0) return vector
    return new Vector2d(vector.x / scalar, vector.y / scalar)
  }

  static magnitude(vector: Vector2d): number {
    return Math.sqrt(this.magnitudeSquared(vector))
  }

  static magnitudeSquared(vector: Vector2d): number {
    return (vector.x * vector.x) + (vector.y * vector.y)
  }
  
  static normalize(vector: Vector2d): Vector2d {
    const magnitude = this.magnitude(vector)
    if (magnitude === 0) {
      return vector
    }
    return new Vector2d(vector.x / magnitude, vector.y/ magnitude)
  }

  static setMagnitude(vector: Vector2d, scalar: number): Vector2d {
    const normalizedVector = this.normalize(vector)
    return this.scalarMultiply(normalizedVector, scalar)
  }

  static limit(vector: Vector2d, limit: number): Vector2d {
    if (Vector2d.magnitude(vector) > limit) {
      return Vector2d.setMagnitude(vector, limit)
    }
    
    return vector
  }
}