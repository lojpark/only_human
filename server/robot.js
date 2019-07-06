const Creature = require ('../server/creature.js');

class Robot extends Creature {
    constructor(x, y, type, map) {
        super(x, y, type, map);

        this.id = Math.random();
    }

    ai() {
        this.isRightPress = true;
    }

    update() {
        this.ai();

        super.update();
    }
}

module.exports = Robot;