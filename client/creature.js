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
        this.fireAngle = 0;

        this.motion = new Object();
        this.motion.run = 0;
        this.motion.down = 0;
        this.motion.up = 0;

        this.weapon = new Weapon(context);

        this.image = new Image();
        this.image.src = "client/image/player.png";
    }

    print(screen) {
        // Save the canvas
        this.context.save();

        let x = Math.floor(this.map.modular(this.x + this.w / 2 - screen.x, "WIDTH") - this.w);
        const y = Math.floor(this.map.modular(this.y + this.h / 2 - screen.y, "HEIGHT") - this.h);
        let mRun = Math.floor(this.motion.run);
        let mUp = Math.floor(this.motion.up);
        const mDown = Math.floor(this.motion.down);

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

        if (this.state == "DEAD") {
            this.context.drawImage(this.image, 1 * this.w, 5 * this.h, 42, this.h, x, y, 42, this.h);
        }
        else {
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
        }

        // Restore the canvas
        this.context.restore();
    }
}