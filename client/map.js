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
        let rowOffset = screen.height / 30;
        let colOffset = screen.width / 30;
        let si = Math.round((screen.y + screen.height / 2) / 30 - rowOffset / 2);
        let sj = Math.round((screen.x + screen.width / 2) / 30 - colOffset / 2) - 1;

        for (let i = si; i < si + rowOffset; i++) {
            for (let j = sj; j <= sj + colOffset + 1; j++) {
                let row = i, col = j;
                row = this.modular(row, "ROW");
                col = this.modular(col, "COL");
                if (this.map[row][col] == 0) continue;
                this.context.drawImage(this.image, (this.map[row][col] - 1) * 30, 0, 30, 30, j * 30 - screen.x, i * 30 - screen.y, 30, 30);
            }
        }
    }
}