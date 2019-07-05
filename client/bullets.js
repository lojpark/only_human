class Bullets{
    constructor(map, context) {
        this.map = map;
        this.context = context;

        this.w = this.h = 5;
        this.bullets = [];

        this.image = new Image();
        this.image.src = "client/image/bullet.png";
    }

    update(packedBullets) {
        this.bullets = [];
        for (let i = 0; i < packedBullets.length; i++) {
            this.bullets[i] = packedBullets[i];
        }
    }

    print(screen) {
        for (let k = 0; k < this.bullets.length; k++) {
            const ox = Math.floor(this.bullets[k].x - screen.x - this.w / 2);
            const oy = Math.floor(this.bullets[k].y - screen.y - this.h / 2);
            const delta = [-1, 0, 1];

            // Print image
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const x = ox + delta[i] * screen.MAP_WIDTH;
                    const y = oy + delta[j] * screen.MAP_HEIGHT;

                    if (x < -3 || y < -3 || x > screen.SCREEN_WIDTH + 3 || y > screen.SCREEN_HEIGHT + 3) continue;
                    context.drawImage(this.image, 0, 0, this.w, this.h, x, y, this.w, this.h);
                }
            }
        }
    }
}