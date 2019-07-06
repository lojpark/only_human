const Creature = require ('../server/creature.js');

class Human extends Creature {
    constructor(id, x, y, type, map) {
        super(x, y, type, map);

        this.id = id;

        this.snipeX = this.snipeY = 0;
        this.snipeVx = this.snipeVy = 0;
        this.snipeRange = 600;

        this.isUpPress = false;
        this.isDownPress = false;
        this.isLeftPress = false;
        this.isRightPress = false;
        this.isJumpPress = false;
        this.isSnipe = false;
    }

    update() {
        super.update();

        // Stop moving when player is sniping
        if (this.state == "SNIPE") {
            return;
        }

        let dx = 0, dy = 0;

        // Make state IDLE
        if (this.state == "RUN") this.state = "IDLE";

        // Move Right or Left
        if (this.isRightPress && this.state != "SIT") {
            dx += this.speed;
            if (this.dir == "LEFT") this.fireAngle = 180 - this.fireAngle;
            this.dir = "RIGHT";
            if (this.state != "JUMP") this.state = "RUN";
        }
        if (this.isLeftPress && this.state != "SIT") {
            dx -= this.speed;
            if (this.dir == "RIGHT") this.fireAngle = 180 - this.fireAngle;
            this.dir = "LEFT";
            if (this.state != "JUMP") this.state = "RUN";
        }

        // Aim up
        if (this.isUpPress) {
            // Change motion from bottom if it is shooting down
            if (this.motion.down > 0) {
                this.motion.down -= 0.5;
                if (this.motion.down < 0) this.motion.down = 0;
            }
            // Change motion to top
            else {
                this.motion.up += 0.5;
                if (this.motion.up >= 4) this.motion.up = 3;
            }
            // Left direction angle
            if (this.dir == "LEFT") {
                this.fireAngle += 8;
                if (this.fireAngle > 270) this.fireAngle = 270;
            }
            // Right direction angle
            else {
                this.fireAngle -= 8;
                if (this.fireAngle <= - 90) this.fireAngle = -90;
            }
        }

        // Aim down
        if (this.isDownPress) {
            // Can only shooting down during jump
            if (this.state == "JUMP") {
                // Change motion from top if it is shooting up
                if (this.motion.up > 0) {
                    this.motion.up -= 1;//0.5;
                    if (this.motion.up < 0) this.motion.up = 0;
                }
                // Change motion to bottom
                else {
                    this.motion.down += 1;//0.5;
                    if (this.motion.down >= 4) this.motion.down = 3;
                }

                // Left direction angle
                if (this.dir == "LEFT") {
                    this.fireAngle -= 15;
                    if (this.fireAngle <= 90) this.fireAngle = 90;
                }
                // Right direction angle
                else {
                    this.fireAngle += 15;
                    if (this.fireAngle >= 90) this.fireAngle = 90;
                }
            }
            // Sit
            else {
                this.state = "SIT";
            }
        }
        // Make state IDLE
        else if (this.state == "SIT") this.state = "IDLE";

        // Aim middle
        if (!this.isUpPress && (!this.isDownPress || this.state == "SIT")) {
            // Left direction angle
            if (this.dir == "LEFT") {
                if (this.fireAngle > 180) {
                    this.fireAngle -= 15;
                    if (this.fireAngle <= 180) this.fireAngle = 180;
                }
                else {
                    this.fireAngle += 8;
                    if (this.fireAngle >= 180) this.fireAngle = 180;
                }
            }
            // Rigt direction angle
            else {
                if (this.fireAngle < 0) {
                    this.fireAngle += 15;
                    if (this.fireAngle >= 0) this.fireAngle = 0;
                }
                else {
                    this.fireAngle -= 8;
                    if (this.fireAngle <= 0) this.fireAngle = 0;
                }
            }
            // Change motion to middle
            this.motion.up -= 0.5;
            if (this.motion.up < 0) this.motion.up = 0;
            this.motion.down -= 0.5;
            if (this.motion.down < 0) this.motion.down = 0;
        }

        // Change running motion
        this.runMotion();

        // Jump
        if (this.isJumpPress && this.state != "JUMP") {
            this.jump();
        }

        // Move position
        this.x = this.map.modular(this.x + dx, "WIDTH");
        this.y = this.map.modular(this.y + dy, "HEIGHT");

        // Check obstacle
        this.checkObstacle();
    }
}

module.exports = Human;