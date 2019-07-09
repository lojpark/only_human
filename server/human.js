const Creature = require ('../server/creature.js');

class Human extends Creature {
    constructor(id, x, y, type, bullets, leaderboard, map) {
        super(x, y, type, bullets, leaderboard, map);

        this.id = id;
        this.species = "HUMAN";

        this.snipeRange = 600;
    }
}

module.exports = Human;