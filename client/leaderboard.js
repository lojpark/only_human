class LeaderBoard {
    constructor(context) {
        this.context = context;

        this.leaders = {};
    }

    update(packedLeaderBoard) {
        this.leaders = [];
        for (let i = 0; i < packedLeaderBoard.length; i++) {
            this.leaders[i] = packedLeaderBoard[i];
        }
    }

    print() {
        
    }
}