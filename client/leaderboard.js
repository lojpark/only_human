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

        this.leaders.sort(function(t, u) {
            return u.score - t.score;
        });
    }

    print(screen) {
        context.fillStyle = "rgb(255,255,255)";

        context.font = "18px consolas bold";
        context.fillText("Leader Board", screen.width - 175, 30);

        context.font = "15px consolas";
        let rank = 1, y = 55, alpha = 1.0;
        for (let i = 0; i < this.leaders.length; i++) {
            context.fillStyle = "rgb(255,255,255," + alpha.toString() + ")";
            context.fillText("#" + rank.toString(), screen.width - 210, y);
            context.fillText(this.leaders[i].name, screen.width - 180, y);
            context.fillText(this.leaders[i].score, screen.width - 30, y);

            rank++;
            y += 15;
            alpha -= 0.09;
            if (rank > 10) {
                break;
            }
        }
    }
}