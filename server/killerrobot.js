const Robot = require ('../server/robot.js');

class KillerRobot extends Robot {
    constructor(x, y, type, bullets, map) {
        super(x, y, type, bullets, map);

        this.species = "KILLER_ROBOT";
    }

    ai() {
        super.ai();
    }

    update() {
        this.ai();

        super.update();
    }
}

module.exports = KillerRobot;