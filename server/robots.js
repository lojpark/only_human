const Robot = require('../server/robot.js');

class Robots {
    constructor(map) {
        this.map = map;

        this.robots = [];
    }

    addRobot(x, y, type) {
        this.robots.push(new Robot(x, y, type, this.map));
    }

    spawnRobots(number) {
        for (let i = 1; i <= number; i++) {
            this.addRobot(30, 30, 1);
        }
    }

    update() {
        let pack = [];

        for (let i = this.robots.length - 1; i >= 0; i--) {
            this.robots[i].update();

            // Remove dead robot
            if (!this.robots[i].isAlive) {
                this.robots.splice(i, 1);
            }
            // Packing
            else {
                pack.push({
                    x: this.robots[i].x,
                    y: this.robots[i].y,
                    dir: this.robots[i].dir,
                    state: this.robots[i].state,
                    motion: this.robots[i].motion,
                });
            }
        }

        return pack;
    }
}

module.exports = Robots;