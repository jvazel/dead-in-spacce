export const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
export const rand = (min, max) => Math.random() * (max - min) + min;
export const checkCircleCollision = (c1, c2) => dist(c1.x, c1.y, c2.x, c2.y) < (c1.radius + c2.radius);
