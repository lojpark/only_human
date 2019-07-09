class LeaderBoard {
    constructor(width, height) {
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
    }
}

module.exports = LeaderBoard;