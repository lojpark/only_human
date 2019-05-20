class Bullet {
    constructor(x, y, angle, map, context) {
        this.x = this.ox = x;
        this.y = this.oy = y;
        this.vy = 0;
        this.w = 5;
        this.h = 5;
        this.angle = angle;
        this.speed = 25;

        this.map = map;
        this.context = context;

        this.image = new Image();
        this.image.src = "../client/image/bullet.png";
    }

    update() {
        // Move position
        this.x += this.speed * Math.cos(this.angle * 3.14 / 180);
        this.y += this.speed * Math.sin(this.angle * 3.14 / 180) + this.vy;
        if (this.speed * Math.sin(this.angle * 3.14 / 180) + this.vy < 25) this.vy += 0.5;

        // Modular
        this.x = this.map.modular(this.x, "WIDTH");
        this.y = this.map.modular(this.y, "HEIGHT");
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