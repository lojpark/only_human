class Creature {
    constructor(x, y, type, bullets, leaderboard, map) {
        this.bullets = bullets;
        this.leaderboard = leaderboard;
        this.map = map;

        this.id = Math.random();
        this.type = type;
        this.species = "";

        this.w = 32;
        this.h = 48;

        this.x = x;
        this.y = y;
        this.isAlive = true;
        this.vy = 0;
        this.vx = 0;
        this.dir = "RIGHT";
        this.state = "IDLE";
        this.speed = 2.5;
        this.fireAngle = 0;
        this.deadTimer = 0;

        this.motion = new Object();
        this.motion.run = 0;
        this.motion.down = 0;
        this.motion.up = 0;

        this.isUpPress = false;
        this.isDownPress = false;
        this.isLeftPress = false;
        this.isRightPress = false;
        this.isJumpPress = false;
        this.isSnipe = false;

        this.fs = require('fs');
        this.writer = null;
    }

    record() {
        if (this.writer == null) {
            this.writer = this.fs.createWriteStream('D:\\trace\\' + this.id.toString() + '.txt');
            if (this.species != "HUMAN") {
                this.writer.write(this.gene[0].toString());
                for (let i = 1; i < 12; i++) {
                    this.writer.write(',' + this.gene[i].toString());
                }
                this.writer.write('|');
            }
        }
        let state = 0;
        state += this.isJumpPress;
        state <<= 1;
        state += this.isLeftPress;
        state <<= 1;
        state += this.isRightPress;
        state <<= 1;
        state += this.isUpPress;
        state <<= 1;
        state += this.isDownPress;
        this.writer.write(state.toString() + ',');
    }

    jump() {
        this.vy = -11;
        this.state = "JUMP";
        this.isJumpPress = false;
    }

    gravity() {
        // Accelerate the gravity
        if (this.vy < 14) this.vy += 0.7;
        // Change y position
        this.y += this.vy;

        var x = this.map.modular(Math.floor((this.x + 2) / 30), "COL");
        var lx = this.map.modular(Math.floor((this.x - 10) / 30), "COL");
        var rx = this.map.modular(Math.floor((this.x + 10) / 30), "COL");
        var y = this.map.modular(Math.floor((this.y - 24) / 30), "ROW");

        // When touch ceiling
        if ((this.map.map[y][x] == 1 || this.map.map[y][lx] == 1 || this.map.map[y][rx] == 1) && this.vy < 0) {
            this.y = y * 30 + 48;
            this.vy = 0;
            return;
        }

        y = this.map.modular(Math.floor((this.y + 24) / 30), "ROW");
        // When touch floor
        if ((this.map.map[y][x] != 0 || this.map.map[y][lx] != 0 || this.map.map[y][rx] != 0) &&
            this.vy > 0 && this.y - this.vy <= y * 30 - 24) {
            this.y = y * 30 - 24;
            this.vy = 0;
            if (this.state == "JUMP")
                this.state = "IDLE";
        }
        else if (this.state != "DEAD")
            this.state = "JUMP";
    }

    checkObstacle() {
        var lx = this.map.modular(Math.floor((this.x - 14) / 30), "COL");
        var rx = this.map.modular(Math.floor((this.x + 16) / 30), "COL");
        var uy = this.map.modular(Math.floor((this.y - 12) / 30), "ROW");
        var dy = this.map.modular(Math.floor((this.y + 18) / 30), "ROW");

        // When touch obstacles
        if (this.map.map[uy][lx] == 1 || this.map.map[dy][lx] == 1)
            this.x = lx * 30 + 42;
        if (this.map.map[uy][rx] == 1 || this.map.map[dy][rx] == 1)
            this.x = rx * 30 - 14;

        this.x = this.map.modular(this.x, "WIDTH");
    }

    checkBulletHit() {
        if (this.state == "DEAD") {
            return;
        }

        for (let i = 0; i < this.bullets.bullets.length; i++) {
            if (this.x - this.w / 2 <= this.bullets.bullets[i].x && this.bullets.bullets[i].x <= this.x + this.w / 2) {
                if (this.y - this.h / 2 <= this.bullets.bullets[i].y && this.bullets.bullets[i].y <= this.y + this.h / 2) {
                    if (this.id != this.bullets.bullets[i].id) {
                        this.state = "DEAD";
                        this.deadTimer = 100 + Math.random() * 200;
                        this.bullets.bullets[i].isAlive = false;
                        if (this.species == "HUMAN" || this.species == "KILLER_ROBOT") {
                            this.leaderboard.update(this.bullets.bullets[i].id, "KILL");
                            this.leaderboard.update(this.id, "DIE");
                        }
                        return;
                    }
                }
            }
        }
    }

    runMotion() {
        if (this.state == "RUN") {
            this.motion.run += 0.2;
            if (this.motion.run >= 9) this.motion.run = 1;
        }
        else this.motion.run = 0;
    }

    update() {
        this.gravity();
        this.checkBulletHit();

        // Stop moving when player is dead
        if (this.state == "DEAD") {
            this.deadTimer--;
            if (this.deadTimer <= 0) {
                this.isAlive = false;
            }
            return;
        }

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
                this.motion.down -= 0.2;
                if (this.motion.down < 0) this.motion.down = 0;
            }
            // Change motion to top
            else {
                this.motion.up += 0.2;
                if (this.motion.up >= 4) this.motion.up = 3;
            }
            // Left direction angle
            if (this.dir == "LEFT") {
                this.fireAngle += 4;
                if (this.fireAngle > 270) this.fireAngle = 270;
            }
            // Right direction angle
            else {
                this.fireAngle -= 4;
                if (this.fireAngle <= - 90) this.fireAngle = -90;
            }
        }

        // Aim down
        if (this.isDownPress) {
            // Can only shooting down during jump
            if (this.state == "JUMP") {
                // Change motion from top if it is shooting up
                if (this.motion.up > 0) {
                    this.motion.up -= 0.34;
                    if (this.motion.up < 0) this.motion.up = 0;
                }
                // Change motion to bottom
                else {
                    this.motion.down += 0.34;
                    if (this.motion.down >= 4) this.motion.down = 3;
                }

                // Left direction angle
                if (this.dir == "LEFT") {
                    this.fireAngle -= 10;
                    if (this.fireAngle <= 90) this.fireAngle = 90;
                }
                // Right direction angle
                else {
                    this.fireAngle += 10;
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
                    this.fireAngle -= 10;
                    if (this.fireAngle <= 180) this.fireAngle = 180;
                }
                else {
                    this.fireAngle += 4;
                    if (this.fireAngle >= 180) this.fireAngle = 180;
                }
            }
            // Rigt direction angle
            else {
                if (this.fireAngle < 0) {
                    this.fireAngle += 10;
                    if (this.fireAngle >= 0) this.fireAngle = 0;
                }
                else {
                    this.fireAngle -= 4;
                    if (this.fireAngle <= 0) this.fireAngle = 0;
                }
            }
            // Change motion to middle
            this.motion.up -= 0.34;
            if (this.motion.up < 0) this.motion.up = 0;
            this.motion.down -= 0.34;
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

        // Record the trace information
        if (this.species != "HUMAN") {
            //this.record();
        }
    }
}

module.exports = Creature;