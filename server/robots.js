const Robot = require('../server/robot.js');
const KillerRobot = require('../server/killerrobot.js');

class Robots {
    constructor(bullets, leaderboard, map) {
        this.bullets = bullets;
        this.leaderboard = leaderboard;
        this.map = map;

        this.robots = [];
    }

    addRobot(x, y, type) {
        this.robots.push(new KillerRobot(x, y, type, this.bullets, this.leaderboard, this.map));
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
                // And respawn it
                this.addRobot(30, 30, 1);
            }
        }
        for (let i = 0; i < this.robots.length; i++) {
            pack.push({
                x: this.robots[i].x,
                y: this.robots[i].y,
                id: this.robots[i].id,
                dir: this.robots[i].dir,
                state: this.robots[i].state,
                motion: this.robots[i].motion,
            });
        }

        return pack;
    }
}

module.exports = Robots;