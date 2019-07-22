const Robot = require ('../server/robot.js');

class KillerRobot extends Robot {
    constructor(x, y, type, players, bullets, leaderboard, map) {
        super(x, y, type, bullets, leaderboard, map);

        this.players = players;

        this.species = "KILLER_ROBOT";
        leaderboard.update(this.id, "CREATE");

        this.target = null;

        this.snipeTimer = 0;
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    };

    setTarget(target) {
        this.target = target;
    }

    snipeTarget() {
        if (this.target == null) {
            return;
        }

        if (this.distance(this.target.x, this.target.y, this.x, this.y) > 600) {
            return;
        }

        this.snipeTimer = this.distance(this.target.x, this.target.y, this.x, this.y) / 10 + Math.random() * 100;
        this.state = "SNIPE";
    }

    ai() {
        if (this.state == "DEAD") {
            return;
        }

        if (this.state == "SNIPE") {
            this.snipeTimer--;
            if (this.snipeTimer <= 0) {
                this.state = "IDLE";

                if (this.target == null) {
                    return;
                }
                if (this.target.state == "DEAD") {
                    this.target = null;
                    return;
                }
                if (this.distance(this.target.x, this.target.y, this.x, this.y) > 600) {
                    return;
                }

                let angle, dist, minError = 65536;
                let fireAngle = 0;

                for (angle = 0; angle < 360; angle += 1) {
                    for (dist = 0; dist < 600; dist += 25) {
                        let destX = this.x + dist * Math.cos(angle * 3.14 / 180);
                        let destY = this.y + dist * Math.sin(angle * 3.14 / 180) + ((dist / 25) * (0.5 * (1 + dist / 25))) / 2;
                        let error = this.distance(this.target.x, this.target.y, destX, destY);
                        if (minError > error) {
                            minError = error;
                            fireAngle = angle;
                        }
                    }
                }

                this.bullets.addBullet(this.id, this.x, this.y, fireAngle, 600);
            }
            return;
        }
        
        super.ai();

        this.setTarget();

        if (Math.random() < 0.001) {
            this.snipeTarget();
        }
    }

    update() {
        this.ai();

        super.update();
    }
}

module.exports = KillerRobot;