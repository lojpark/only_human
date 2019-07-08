const Creature = require ('../server/creature.js');

class Human extends Creature {
    constructor(id, x, y, type, bullets, map) {
        super(x, y, type, bullets, map);

        this.id = id;

        this.snipeRange = 600;
    }
}

module.exports = Human;