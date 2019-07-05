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
    }

    shot() {
        // Shot
        if (this.state == "SIT") {
            this.state = "SNIPE";
            this.snipeX = this.x;
            this.snipeY = this.y;
            this.snipeVx = this.snipeVy = 0;
        }
        else if (this.state == "SNIPE") {
            this.state = "IDLE";
            
            let angle, dist, minError = 65536;
            this.fireAngle = 0;

            for (angle = 0; angle < 360; angle++) {
                for (dist = 0; dist < 600; dist += 25) {
                    let destX = this.x + dist * Math.cos(angle * 3.14 / 180);
                    let destY = this.y + dist * Math.sin(angle * 3.14 / 180) + ((dist / 25) * (0.5 * (1 + dist / 25))) / 2;
                    let error = this.distance(this.snipeX, this.snipeY, destX, destY);
                    if (minError > error) {
                        minError = error;
                        this.fireAngle = angle;
                    }
                }
            }
        }
    }

    update() {
        // Sniping
        if (this.state == "SNIPE") {
            this.snipe();
            return;
        }
    }

    printSnipe(screen) {
        if (this.state != "SNIPE") return;

        // Aiming point
        context.drawImage(this.snipeImage, 0, 0, 32, 32, this.snipeX - 16 - screen.x, this.snipeY - 16 - screen.y, 32, 32);

        // Aiming circle
        context.fillStyle = "rgba(0, 255, 0, 0.05)";
        context.beginPath();
        context.arc(this.x - screen.x, this.y - screen.y, this.snipeRange, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();

        // Aiming circle border
        context.strokeStyle = "rgb(0, 255, 0)";
        for (let range = this.snipeRange; range >= 100; range -= 200) {
            context.beginPath();
            context.arc(this.x - screen.x, this.y - screen.y, range, 0, Math.PI * 2, false);
            context.closePath();
            context.stroke();
        }
    }
}