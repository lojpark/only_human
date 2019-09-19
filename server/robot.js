const Creature = require ('../server/creature.js');

class Robot extends Creature {
    constructor(x, y, type, bullets, leaderboard, map) {
        super(x, y, type, bullets, leaderboard, map);

        this.species = "ROBOT";

        this.actionLR = 0;
        this.actionUD = 0;
        this.timerLR = 0;
        this.timerUD = 0;

        this.gene = [0.005, 0.1, 0.8, 0.5, 100, 100, 150, 0.33, 0.33, 150, 150, 150];
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
            if (Math.random() < this.gene[0]) {
                this.isJumpPress = true;
            }
            // Jump before empty floor
            if (Math.random() < this.gene[1]) {
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
            if (rv <= this.gene[2]) {
                this.actionUD = 0;
                this.timerUD = Math.floor(this.gene[4] + Math.random() * 5 - 10);
            }
            else if (rv <= this.gene[2] + (1.0 - this.gene[2]) * this.gene[3]) {
                this.actionUD = 1;
                this.timerUD = Math.floor(this.gene[5] + Math.random() * 5 - 10);
            }
            else {
                this.actionUD = 2;
                this.timerUD = Math.floor(this.gene[6] + Math.random() * 5 - 10);
            }

            this.isUpPress = this.isDownPress = false;
        }
        if (this.timerLR <= 0) {
            let rv = Math.random();
            if (rv <= this.gene[7]) {
                this.actionLR = 0;
                this.timerLR = Math.floor(this.gene[9] + Math.random() * 5 - 10);
            }
            else if (rv <= this.gene[7] + (1.0 - this.gene[7]) * this.gene[8]) {
                this.actionLR = 1;
                this.timerLR = Math.floor(this.gene[10] + Math.random() * 5 - 10);
            }
            else {
                this.actionLR = 2;
                this.timerLR = Math.floor(this.gene[11] + Math.random() * 5 - 10);
            }

            this.isLeftPress = this.isRightPress = false;
        }
    }

    update() {
        this.ai();

        super.update();
    }
}

module.exports = Robot;