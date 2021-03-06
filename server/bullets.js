const Bullet = require('../server/bullet.js');

class Bullets {
    constructor(map) {
        this.map = map;

        this.bullets = [];
    }

    addBullet(id, x, y, angle, range) {
        this.bullets.push(new Bullet(id, x, y, angle, range, this.map));
    }

    update() {
        let pack = [];

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();

            // Remove dead bullet
            if (!this.bullets[i].isAlive) {
                this.bullets.splice(i, 1);
            }
            // Packing
            else {
                pack.push({
                    x: this.bullets[i].x,
                    y: this.bullets[i].y,
                });
            }
        }

        return pack;
    }
}

module.exports = Bullets;