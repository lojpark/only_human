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

        for (i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update();
        }
    }

    print(screen) {
        let i;

        for (i = 0; i < this.bullets.length; i++) {
            this.bullets[i].print(screen);
        }
    }
}