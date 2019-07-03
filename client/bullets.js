class Bullets{
    constructor(map, context) {
        this.map = map;
        this.context = context;

        this.bullets = [];
    }

    addBullet(x, y, angle) {
        this.bullets.push(new Bullet(x, y, angle, this.map, this.context));
    }

    update() {
        let i;

        for (i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();

            // Remove dead bullet
            if (!this.bullets[i].isAlive) {
                this.bullets.splice(i, 1);
            }
        }
    }

    print(screen) {
        let i;

        for (i = 0; i < this.bullets.length; i++) {
            this.bullets[i].print(screen);
        }
    }
}