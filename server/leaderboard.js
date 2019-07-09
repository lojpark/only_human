class LeaderBoard {
    constructor() {
        this.leaders = {};
    }

    update(id, state) {
        if (state == "CREATE") {
            this.leaders[id] = new Object();
            this.leaders[id].name = "Doge";
            this.leaders[id].score = 0;
        }
        if (state == "KILL") {
            this.leaders[id].score++;
        }
        if (state == "DIE") {
            delete this.leaders[id];
        }

        if (state == "PACKING") {
            let pack = [];

            for (let id = 0; id < this.leaders.length; id++) {
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