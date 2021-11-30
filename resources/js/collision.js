export class Collision {
  collision(a, b, pair) {
    throw new Error("Unimplemented method!")
  }
}

// Rectangle vs Rectangle
export class RRCollision extends Collision {
  static instance = new RRCollision()

  collision(a, b, pair) {
    const ra = a.shape
    const rb = b.shape

    const nx = b.position.x - a.position.x
    const penetrationX = ra.halfWidth + rb.halfWidth - Math.abs(nx)

    if (penetrationX > 0.0) {
      // Check X
      const ny = b.position.y - a.position.y
      const penetrationY = ra.halfHeight + rb.halfHeight - Math.abs(ny)
      if (penetrationY > 0.0) {
        // Check y
        if (penetrationY > penetrationX) {
          pair.normal.x = nx > 0 ? 1 : -1
          pair.normal.y = 0
          pair.penetration = penetrationX
        } else {
          pair.normal.y = ny > 0 ? 1 : -1
          pair.normal.x = 0
          pair.penetration = penetrationY
        }
        return true
      }
    }

    return false
  }
}

// Rectangle vs Circle
export class RCCollision extends Collision {
  static instance = new RCCollision()

  collision(a, b, pair) {
    if (CRCollision.instance.collision(b, a, pair)) {
      pair.normal.negate()
      return true
    }
    return false
  }
}

// Circle vs Rectangle
export class CRCollision extends Collision {
  static instance = new CRCollision()

  collision(a, b, pair) {
    const ca = a.shape
    const rb = b.shape

    var dx = b.position.x - a.position.x
    var dy = b.position.y - a.position.y

    var cx = clamp(dx, -rb.halfWidth, rb.halfWidth)
    var cy = clamp(dy, -rb.halfHeight, rb.halfHeight)

    let distance
    if (dx === cx && dy === cy) {
      if (Math.abs(dx) > Math.abs(dy)) {
        cx = cx > 0 ? rb.halfWidth : -rb.halfWidth
      } else {
        cy = cy > 0 ? rb.halfHeight : -rb.halfHeight
      }
      dx = cx - dx
      dy = cy - dy
      distance = Math.sqrt(dx * dx + dy * dy)
    } else {
      dx -= cx
      dy -= cy
      let len2 = dx * dx + dy * dy
      if (len2 > ca.radius * ca.radius) {
        return false
      }
      distance = Math.sqrt(len2)
    }

    pair.normal.set(dx, dy).scl(1.0 / distance)
    pair.penetration = ca.radius - distance

    return true
  }
}

// Circle vs Circle
export class CCCollision extends Collision {
  static instance = new CCCollision()

  collision(a, b, pair) {
    const ca = a.shape
    const cb = b.shape

    const normal = pair.normal.set(b.position).sub(a.position)
    const len2 = normal.len2()
    const radius = ca.radius + cb.radius

    if (len2 < radius * radius) {
      // Check penetration
      const distance = Math.sqrt(len2)
      if (distance === 0.0) {
        // Same position
        normal.set(1, 0)
        pair.penetration = Math.max(ca.radius, cb.radius)
      } else {
        normal.scl(1.0 / distance) // normalize
        pair.penetration = radius - distance
      }
      return true
    }
    return false
  }
}

const clamp = (value, min, max) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

export const COLLISIONS = [
  RRCollision.instance, RCCollision.instance,
  CRCollision.instance, CCCollision.instance,
]
