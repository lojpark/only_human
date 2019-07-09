class Bullet {
    constructor(id, x, y, angle, range, map) {
        this.id = id;
        this.x = this.ox = x;
        this.y = this.oy = y;
        this.vy = 0;
        this.w = 5;
        this.h = 5;
        this.angle = angle;
        this.speed = 25;
        this.range = 0;
        this.maxRange = range;
        this.isAlive = true;
        this.isKill = false;

        this.map = map;
    }

    checkObstacle() {
        let x = this.map.modular(Math.floor(this.x / 30), "COL");
        let y = this.map.modular(Math.floor(this.y / 30), "ROW");

        // When touch obstacles
        if (this.map.map[y][x] == 1)
            return true;

        return false;
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
    }

    update() {
        let dx = this.speed * Math.cos(this.angle * 3.14 / 180);
        let dy = this.speed * Math.sin(this.angle * 3.14 / 180) + this.vy;

        // Move position
        this.x += dx;
        this.y += dy;
        if (dy < 20) this.vy += 0.5;

        // Modular
        this.x = this.map.modular(this.x, "WIDTH");
        this.y = this.map.modular(this.y, "HEIGHT");

        // Record the moved distance
        this.range += this.getDistance(0, 0, dx, dy);

        // Touch obstacles
        if (this.checkObstacle()) {
            this.isAlive = false;
        }

        // Out of range
        if (this.range >= this.maxRange) {
            this.isAlive = false;
        }
    }
}

module.exports = Bullet;