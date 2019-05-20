class Creature {
    constructor(x, y, type, map, context) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.map = map;
        this.context = context;

        this.w = 32;
        this.h = 48;
        this.vy = 0;
        this.vx = 0;
        this.dir = "RIGHT";
        this.state = "IDLE";
        this.speed = 6;
        this.fireAngle = 0;

        this.motionRun = 0;
        this.motionDown = 0;
        this.motionUp = 0;

        this.weapon = new Weapon(context);

        this.image = new Image();
        this.image.src = "../client/image/player.png";
    }

    jump() {
        this.vy = -15;
        this.state = "JUMP";
    }

    gravity() {
        // Accelerate the gravity
        if (this.vy < 20) this.vy += 1.5;
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

        // When touch obstacle
        if (this.map.map[uy][lx] == 1 || this.map.map[dy][lx] == 1)
            this.x = lx * 30 + 42;
        if (this.map.map[uy][rx] == 1 || this.map.map[dy][rx] == 1)
            this.x = rx * 30 - 14;

        this.x = this.map.modular(this.x, "WIDTH");
    }

    runMotion() {
        if (this.state == "RUN") {
            this.motionRun += 0.34;
            if (this.motionRun >= 9) this.motionRun = 1;
        }
        else this.motionRun = 0;
    }

    print(screen) {
        // Save the canvas
        this.context.save();

        let x = this.x - this.w / 2 - screen.x;
        const y = this.y - this.h / 2 - screen.y;
        let mRun = Math.floor(this.motionRun);
        let mUp = Math.floor(this.motionUp);
        const mDown = Math.floor(this.motionDown);

        // Sit
        if (this.state == "SIT" || this.state == "SNIPE") {
            mRun = 0;
            mUp = 5;
        }

        // If the direction is left, reverse the canvas
        if (this.dir == "LEFT") {
            this.context.scale(-1, 1);
            x *= -1;
            x -= 32;
        }

        if (this.state != "JUMP") {
            this.context.drawImage(this.image, mRun * this.w, mUp * this.h, this.w, this.h, x, y, this.w, this.h);
        }
        else {
            if (mDown == 0) {
                this.context.drawImage(this.image, mUp * this.w, 4 * this.h, this.w, this.h, x, y, this.w, this.h);
            }
            else {
                this.context.drawImage(this.image, (mDown + 3) * this.w, 4 * this.h, this.w, this.h, x, y, this.w, this.h);
            }
        }

        this.weapon.print(x, y, this.state, mRun, mUp, mDown);

        // Restore the canvas
        this.context.restore();
    }
}