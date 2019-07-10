const Creature = require ('../server/creature.js');

class Robot extends Creature {
    constructor(x, y, type, bullets, leaderboard, map) {
        super(x, y, type, bullets, leaderboard, map);

        this.species = "ROBOT";

        this.actionLR = 0;
        this.actionUD = 0;
        this.timerLR = 0;
        this.timerUD = 0;
    }

    ai() {
        if (this.state == "DEAD") {
            return;
        }
        
        // Up or Down
        if (this.actionUD == 1) {
            this.isUpPress = true;
        }
        else if (this.actionUD == 2) {
            this.isDownPress = true;
        }

        // Left or Right
        if (this.actionLR == 1) {
            this.isLeftPress = true;
        }
        else if (this.actionLR == 2) {
            this.isRightPress = true;
        }

        // Jump
        if (this.state != "JUMP") {
            // Random jump
            if (Math.random() < 0.005) {
                this.isJumpPress = true;
            }
            // Jump before empty floor
            if (Math.random() < 0.1) {
                if (this.isLeftPress) {
                    let x = this.map.modular(Math.floor(this.x / 30), "COL");
                    let y = this.map.modular(Math.floor((this.y + this.h / 2) / 30), "ROW");
                    if (this.map.map[y][x] == 0) {
                        this.isJumpPress = true;
                    }
                }
                else if (this.isRightPress) {
                    let x = this.map.modular(Math.floor(this.x / 30), "COL");
                    let y = this.map.modular(Math.floor((this.y + this.h / 2) / 30), "ROW");
                    if (this.map.map[y][x] == 0) {
                        this.isJumpPress = true;
                    }
                }
            }
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
                this.timerUD = Math.floor(Math.random() * 100);
            }
            else {
                this.actionUD = 2;
                this.timerUD = Math.floor(Math.random() * 150);
            }

            this.isUpPress = this.isDownPress = false;
        }
        if (this.timerLR <= 0) {
            this.timerLR = Math.floor(Math.random() * 150);
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