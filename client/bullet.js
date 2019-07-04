class Bullet {
    constructor(x, y, angle, range, map, context) {
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

        this.map = map;
        this.context = context;

        this.image = new Image();
        this.image.src = "../client/image/bullet.png";
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
        if (dy < 25) this.vy += 0.5;

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

    print(screen) {
        const ox = Math.floor(this.x - screen.x - this.w / 2);
        const oy = Math.floor(this.y - screen.y - this.h / 2);
        const delta = [-1, 0, 1];
        let i, j;

        // Print image
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                const x = ox + delta[i] * screen.MAP_WIDTH;
                const y = oy + delta[j] * screen.MAP_HEIGHT;

                if (x < -3 || y < -3 || x > screen.SCREEN_WIDTH + 3 || y > screen.SCREEN_HEIGHT + 3) continue;
                context.drawImage(this.image, 0, 0, this.w, this.h, x, y, this.w, this.h);
            }
        }
    }
}