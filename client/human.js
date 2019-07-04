class Human extends Creature {
    constructor(x, y, type, map, context) {
        super(x, y, type, map, context);

        this.snipeX = this.snipeY = 0;
        this.snipeVx = this.snipeVy = 0;
        this.snipeRange = 600;

        this.isUpPress = false;
        this.isDownPress = false;
        this.isLeftPress = false;
        this.isRightPress = false;
        this.isJumpPress = false;
        this.isShotPress = false;
        this.isSnipe = false;

        this.snipeImage = new Image();
        this.snipeImage.src = "client/image/snipe.png";
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    };

    snipe() {
        // Accelerate
        if (this.isUpPress && this.snipeVy > -20) this.snipeVy -= 1.5;
        if (this.isDownPress && this.snipeVy < 20) this.snipeVy += 1.5;
        if (this.isLeftPress && this.snipeVx > -20) this.snipeVx -= 1.5;
        if (this.isRightPress && this.snipeVx < 20) this.snipeVx += 1.5;

        // Friction
        if (this.snipeVx < 0) this.snipeVx += 0.5;
        if (this.snipeVx > 0) this.snipeVx -= 0.5;
        if (this.snipeVy < 0) this.snipeVy += 0.5;
        if (this.snipeVy > 0) this.snipeVy -= 0.5;

        // Inner range
        if (this.distance(this.x, this.y, this.snipeX + this.snipeVx, this.snipeY + this.snipeVy) < 600) {
            this.snipeX += this.snipeVx;
            this.snipeY += this.snipeVy;
        }
        // Outer range
        else {
            this.snipeX += this.snipeVx;
            this.snipeY += this.snipeVy;
            let angle = Math.atan2(this.snipeY - this.y, this.snipeX - this.x);
            this.snipeX = this.x + 600 * Math.cos(angle);
            this.snipeY = this.y + 600 * Math.sin(angle);
        }

        // Set player's direction
        if (this.snipeX < this.x) this.dir = "LEFT";
        else if (this.snipeX > this.x) this.dir = "RIGHT";

        // Shot
        if (this.isShotPress) {
            let angle, dist, minAngle = 0, minError = 65536;
            for (angle = 0; angle < 360; angle++) {
                for (dist = 0; dist < 600; dist += 25) {
                    let destX = this.x + dist * Math.cos(angle * 3.14 / 180);
                    let destY = this.y + dist * Math.sin(angle * 3.14 / 180) + ((dist / 25) * (0.5 * (1 + dist / 25))) / 2;
                    let error = this.distance(this.snipeX, this.snipeY, destX, destY);
                    if (minError > error) {
                        minError = error;
                        minAngle = angle;
                    }
                }
            }
            bullets.addBullet(this.x, this.y, minAngle, this.snipeRange);

            this.state = "IDLE";
            this.isShotPress = false;
        }
    }

    update() {
        this.gravity();

        /* Sniping */
        if (this.state == "SNIPE") {
            this.snipe();
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
            if (this.motionDown > 0) {
                this.motionDown -= 0.5;
                if (this.motionDown < 0) this.motionDown = 0;
            }
            // Change motion to top
            else {
                this.motionUp += 0.5;
                if (this.motionUp >= 4) this.motionUp = 3;
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
                if (this.motionUp > 0) {
                    this.motionUp -= 1;//0.5;
                    if (this.motionUp < 0) this.motionUp = 0;
                }
                // Change motion to bottom
                else {
                    this.motionDown += 1;//0.5;
                    if (this.motionDown >= 4) this.motionDown = 3;
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
            this.motionUp -= 0.5;
            if (this.motionUp < 0) this.motionUp = 0;
            this.motionDown -= 0.5;
            if (this.motionDown < 0) this.motionDown = 0;
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

        if (this.isShotPress) {
            if (this.state == "SIT") {
                this.state = "SNIPE";
                this.snipeX = this.x;
                this.snipeY = this.y;
                this.snipeVx = this.snipeVy = 0;
            }
            else {
                bullets.addBullet(this.x, this.y, this.fireAngle, this.snipeRange);
            }
            this.isShotPress = false;
        }
    }

    printSnipe(screen) {
        if (this.state != "SNIPE") return;

        /* 조준점 */
        context.drawImage(this.snipeImage, 0, 0, 32, 32, this.snipeX - 16 - screen.x, this.snipeY - 16 - screen.y, 32, 32);

        /* 조준원 */
        context.fillStyle = "rgba(0, 255, 0, 0.05)";
        context.beginPath();
        context.arc(this.x - screen.x, this.y - screen.y, this.snipeRange, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();

        /* 조준원 테두리 */
        context.strokeStyle = "rgb(0, 255, 0)";
        for (let range = this.snipeRange; range >= 100; range -= 200) {
            context.beginPath();
            context.arc(this.x - screen.x, this.y - screen.y, range, 0, Math.PI * 2, false);
            context.closePath();
            context.stroke();
        }
    }
}