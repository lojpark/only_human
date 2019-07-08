const Creature = require ('../server/creature.js');

class Robot extends Creature {
    constructor(x, y, type, bullets, map) {
        super(x, y, type, bullets, map);

        this.action = 0;
        this.timer = 0;
    }

    ai() {
        if (this.action == 1) {
            this.isLeftPress = true;
        }
        else if (this.action == 2) {
            this.isRightPress = true;
        }

        if (Math.random() < 0.01) {
            this.isJumpPress = true;
        }

        this.timer--;

        if (this.timer <= 0) {
            this.timer = Math.floor(Math.random() * 100);
            this.action = Math.floor(Math.random() * 3);

            this.isLeftPress = this.isRightPress = false;
        }
    }

    update() {
        this.ai();

        super.update();
    }
}

module.exports = Robot;