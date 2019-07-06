const Creature = require ('../server/creature.js');

class Human extends Creature {
    constructor(id, x, y, type, map) {
        super(x, y, type, map);

        this.id = id;

        this.snipeRange = 600;
    }
}

module.exports = Human;