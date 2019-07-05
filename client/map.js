class Map {
    constructor(width, height, map, context) {
        this.width = width;
        this.height = height;

        this.context = context;

        this.image = new Image();
        this.image.src = "client/image/tile.png";

        this.map = map;
    }

    modular(number, type) {
        if (type == "ROW") return ((number % (this.height * 16) + this.height * 16)) % (this.height * 16);
        if (type == "COL") return ((number % (this.width * 24) + this.width * 24)) % (this.width * 24);
        if (type == "HEIGHT") return ((number % (this.height * 480) + this.height * 480)) % (this.height * 480);
        if (type == "WIDTH") return ((number % (this.width * 720) + this.width * 720)) % (this.width * 720);
    }

    print(screen) {
        var i, j;
        var si = Math.round((screen.y + 225) / 30) - 8;
        var sj = Math.round((screen.x + 400) / 30) - 14;

        for (i = si; i < si + 16 + 4; i++) {
            for (j = sj; j <= sj + 24 + 4; j++) {
                let row = i, col = j;
                row = this.modular(row, "ROW");
                col = this.modular(col, "COL");
                if (this.map[row][col] == 0) continue;
                this.context.drawImage(this.image, (this.map[row][col] - 1) * 30, 0, 30, 30, j * 30 - screen.x, i * 30 - screen.y, 30, 30);
            }
        }
    }
}