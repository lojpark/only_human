const Robot = require ('../server/robot.js');

class KillerRobot extends Robot {
    constructor(x, y, type, bullets, leaderboard, map) {
        super(x, y, type, bullets, leaderboard, map);

        this.species = "KILLER_ROBOT";
        leaderboard.update(this.id, "CREATE");
    }

    ai() {
        if (this.state == "DEAD") {
            return;
        }

        super.ai();

        if (Math.random() < 0.001) {
            this.bullets.addBullet(this.id, this.x, this.y, 0, 600);
        }
    }

    update() {
        this.ai();

        super.update();
    }
}

module.exports = KillerRobot;