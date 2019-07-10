const Robot = require('../server/robot.js');
const KillerRobot = require('../server/killerrobot.js');

class Robots {
    constructor(players, bullets, leaderboard, map) {
        this.players = players;
        this.bullets = bullets;
        this.leaderboard = leaderboard;
        this.map = map;

        this.robots = [];
    }

    addRobot(x, y, type, species) {
        if (species == "KILLER_ROBOT") {
            this.robots.push(new KillerRobot(x, y, type, this.players, this.bullets, this.leaderboard, this.map));
        }
        else if (species == "ROBOT") {
            this.robots.push(new Robot(x, y, type, this.bullets, this.leaderboard, this.map));
        }
    }

    spawnRobots(killerRobotNumber, robotNumber) {
        for (let i = 1; i <= killerRobotNumber; i++) {
            this.addRobot(30, 30, 1, "KILLER_ROBOT");
        }
        for (let i = 1; i <= robotNumber; i++) {
            this.addRobot(30, 30, 1, "ROBOT");
        }
    }

    update() {
        let pack = [];

        for (let i = this.robots.length - 1; i >= 0; i--) {
            this.robots[i].update();

            // Remove dead robot
            if (!this.robots[i].isAlive) {
                let species = this.robots[i].species;
                this.robots.splice(i, 1);
                // And respawn it
                this.addRobot(30, 30, 1, species);
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