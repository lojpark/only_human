let NAMES = ["Doge", "Newbie", "Go", "Park", "rg", "asdf", "Joe", "KILLER"];

class LeaderBoard {
    constructor() {
        this.leaders = {};
    }

    update(id, state) {
        if (state == "CREATE") {
            this.leaders[id] = new Object();
            this.leaders[id].name = NAMES[Math.floor(Math.random() * NAMES.length)];
            this.leaders[id].score = 0;
        }
        if (state == "KILL" && this.leaders[id] != null) {
            this.leaders[id].score++;
        }
        if (state == "DIE" && this.leaders[id] != null) {
            delete this.leaders[id];
        }

        if (state == "PACKING") {
            let pack = [];

            for (let id in this.leaders) {
                pack.push({
                    name: this.leaders[id].name,
                    score: this.leaders[id].score,
                });
            }

            return pack;
        }
    }
}

module.exports = LeaderBoard;