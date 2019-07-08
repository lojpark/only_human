const Creature = require ('../server/creature.js');

class Robot extends Creature {
    constructor(x, y, type, bullets, map) {
        super(x, y, type, bullets, map);

        this.actionLR = 0;
        this.actionUD = 0;
        this.timerLR = 0;
        this.timerUD = 0;
    }

    ai() {
        if (this.actionUD == 1) {
            this.isUpPress = true;
        }
        else if (this.actionUD == 2) {
            this.isDownPress = true;
        }

        if (this.actionLR == 1) {
            this.isLeftPress = true;
        }
        else if (this.actionLR == 2) {
            this.isRightPress = true;
        }

        if (Math.random() < 0.01) {
            this.isJumpPress = true;
        }

        this.timerUD--;
        this.timerLR--;

        if (this.timerUD <= 0) {
            let rv = Math.random();
            if (rv <= 0.8) {
                this.actionUD = 0;
                this.timerUD = Math.floor(Math.random() * 100);
            }
            else if (rv <= 0.9) {
                this.actionUD = 1;
                this.timerUD = Math.floor(Math.random() * 70);
            }
            else {
                this.actionUD = 2;
                this.timerUD = Math.floor(Math.random() * 100);
            }

            this.isUpPress = this.isDownPress = false;
        }
        if (this.timerLR <= 0) {
            this.timerLR = Math.floor(Math.random() * 100);
            this.actionLR = Math.floor(Math.random() * 3);

            this.isLeftPress = this.isRightPress = false;
        }
    }

    update() {
        this.ai();

        super.update();
    }
}

module.exports = Robot;