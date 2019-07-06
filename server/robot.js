const Creature = require ('../server/creature.js');

class Robot extends Creature {
    constructor(x, y, type, map) {
        super(x, y, type, map);
    }

    update() {
        super();
        
        let dx = 0, dy = 0;

        // Make state IDLE
        if (this.state == "RUN") this.state = "IDLE";

        // Move Right or Left
        if (Math.random() < 0.5) {
            dx += this.speed;
            this.dir = "RIGHT";
        }
        else {
            dx -= this.speed;
            this.dir = "LEFT";
        }
        this.state = "RUN";

        // Change running motion
        this.runMotion();

        // Jump
        if (Math.random() < 0.1 && this.state != "JUMP") {
            this.jump();
        }

        // Move position
        this.x = this.map.modular(this.x + dx, "WIDTH");
        this.y = this.map.modular(this.y + dy, "HEIGHT");

        // Check obstacle
        this.checkObstacle();
    }
}

module.exports = Robot;