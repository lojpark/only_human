const Robot = require('../server/robot.js');
const KillerRobot = require('../server/killerrobot.js');

class Robots {
    constructor(players, bullets, leaderboard, map) {
        this.players = players;
        this.bullets = bullets;
        this.leaderboard = leaderboard;
        this.map = map;

        this.robots = {};

        this.humanCandidate = {};
    }

    addRobot(x, y, type, species) {
        if (species == "KILLER_ROBOT") {
            let newKillerRobot = new KillerRobot(x, y, type, this.players, this.bullets, this.leaderboard, this.map);
            this.robots[newKillerRobot.id] = newKillerRobot;
        }
        else if (species == "ROBOT") {
            let newRobot = new Robot(x, y, type, this.bullets, this.leaderboard, this.map);
            this.robots[newRobot.id] = newRobot;
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

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    };

    findTarget() {
        for (let i = 0; i < this.bullets.bullets.length; i++) {
            if (this.players[this.bullets.bullets[i].id] != null) {
                this.humanCandidate[this.bullets.bullets[i].id] = true;
            }
            if (this.robots[this.bullets.bullets[i].id] != null) {
                this.humanCandidate[this.bullets.bullets[i].id] = true;
            }
        }
    }

    setTarget() {
        for (let robotId in this.robots) {
            if (this.robots[robotId].species != "KILLER_ROBOT") {
                continue;
            }

            for (let targetId in this.humanCandidate) {
                // Target is player
                if (this.players[targetId] != null) {
                    if (this.robots[robotId].distance(this.players[targetId].x, this.players[targetId].y, this.robots[robotId].x, this.robots[robotId].y) > 600) {
                        continue;
                    }
                }
                // Target is killer robot
                else if (this.robots[targetId] != null) {
                    if (this.robots[robotId].distance(this.robots[targetId].x, this.robots[targetId].y, this.robots[robotId].x, this.robots[robotId].y) > 600) {
                        continue;
                    }
                }
                // Target is already dead
                else {
                    continue;
                }

                this.robots[robotId].setTarget(targetId);
                delete this.humanCandidate[targetId];
            }
        }
    }

    update() {
        let pack = [];

        this.findTarget();
        this.setTarget();

        for (let id in this.robots) {
            this.robots[id].update();

            // Remove dead robot
            if (!this.robots[id].isAlive) {
                let species = this.robots[id].species;
                delete this.robots[id];
                // And respawn it
                this.addRobot(30, 30, 1, species);
            }
        }
        for (let id in this.robots) {
            pack.push({
                x: this.robots[id].x,
                y: this.robots[id].y,
                id: id,
                dir: this.robots[id].dir,
                state: this.robots[id].state,
                motion: this.robots[id].motion,
            });
        }

        return pack;
    }
}

module.exports = Robots;