const Robot = require ('../server/robot.js');

class KillerRobot extends Robot {
    constructor(x, y, type, players, bullets, leaderboard, map) {
        super(x, y, type, bullets, leaderboard, map);

        this.players = players;

        this.species = "KILLER_ROBOT";
        leaderboard.update(this.id, "CREATE");

        this.target = {};

        this.snipeTimer = 0;
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    };

    setTarget() {
        for (let id in this.target) {
            if (this.players[id] == null) {
                delete this.target[id];
                continue;
            }

            if (this.distance(this.players[id].x, this.players[id].y, this.x, this.y) > 600) {
                continue;
            }

            this.snipeTimer = this.distance(this.players[id].x, this.players[id].y, this.x, this.y) / 10 + Math.random() * 100;
            this.state = "SNIPE";
            break;
        }
    }

    ai() {
        if (this.state == "DEAD") {
            return;
        }

        if (this.state == "SNIPE") {
            this.snipeTimer--;
            if (this.snipeTimer <= 0) {
                this.state = "IDLE";

                for (let id in this.target) {
                    if (this.players[id] == null) {
                        delete this.target[id];
                        continue;
                    }
                    if (this.players[id].state == "DEAD") {
                        delete this.target[id];
                        continue;
                    }
                    if (this.distance(this.players[id].x, this.players[id].y, this.x, this.y) > 600) {
                        continue;
                    }

                    let angle, dist, minError = 65536;
                    let fireAngle = 0;
    
                    for (angle = 0; angle < 360; angle += 1) {
                        for (dist = 0; dist < 600; dist += 25) {
                            let destX = this.x + dist * Math.cos(angle * 3.14 / 180);
                            let destY = this.y + dist * Math.sin(angle * 3.14 / 180) + ((dist / 25) * (0.5 * (1 + dist / 25))) / 2;
                            let error = this.distance(this.players[id].x, this.players[id].y, destX, destY);
                            if (minError > error) {
                                minError = error;
                                fireAngle = angle;
                            }
                        }
                    }
    
                    this.bullets.addBullet(this.id, this.x, this.y, fireAngle, 600);
                    break;
                }
            }
            return;
        }
        
        super.ai();

        for (let id in this.players) {
            this.target[id] = true;
        }

        if (Math.random() < 0.001) {
            this.setTarget();
        }
    }

    update() {
        this.ai();

        super.update();
    }
}

module.exports = KillerRobot;