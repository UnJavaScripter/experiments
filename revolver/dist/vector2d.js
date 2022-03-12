export class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(vectorsArr) {
        let xComponent = 0;
        let yComponent = 0;
        for (let component of vectorsArr) {
            xComponent += component.x;
            yComponent += component.y;
        }
        return new Vector2d(xComponent, yComponent);
    }
    static subtract(vectorsArr) {
        let xComponent = undefined;
        let yComponent = undefined;
        if (vectorsArr.length === 1) {
            return vectorsArr[0];
        }
        else if (!vectorsArr.length) {
            throw new Error('invalid vectors array length');
        }
        for (let component of vectorsArr) {
            if (xComponent === undefined) {
                xComponent = component.x;
            }
            else {
                xComponent -= component.x;
            }
            if (yComponent === undefined) {
                yComponent = component.y;
            }
            else {
                yComponent -= component.y;
            }
        }
        return new Vector2d(xComponent, yComponent);
    }
    static scalarMultiply(vector, scalar) {
        return new Vector2d(vector.x * scalar, vector.y * scalar);
    }
    static scalarDivide(vector, scalar) {
        if (scalar === 0)
            return vector;
        return new Vector2d(vector.x / scalar, vector.y / scalar);
    }
    static magnitude(vector) {
        return Math.sqrt(this.magnitudeSquared(vector));
    }
    static magnitudeSquared(vector) {
        return (vector.x * vector.x) + (vector.y * vector.y);
    }
    static normalize(vector) {
        const magnitude = this.magnitude(vector);
        if (magnitude === 0) {
            return vector;
        }
        return new Vector2d(vector.x / magnitude, vector.y / magnitude);
    }
    static setMagnitude(vector, scalar) {
        const normalizedVector = this.normalize(vector);
        return this.scalarMultiply(normalizedVector, scalar);
    }
    static limit(vector, limit) {
        if (Vector2d.magnitude(vector) > limit) {
            return Vector2d.setMagnitude(vector, limit);
        }
        return vector;
    }
}
