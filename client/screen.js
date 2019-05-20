class Screen {
    constructor(player, map) {
        this.SCREEN_WIDTH = 800;
        this.SCREEN_HEIGHT = 450;
        this.MAP_WIDTH = map.width * 720;
        this.MAP_HEIGHT = map.height * 480;

        this.x = player.x - this.SCREEN_WIDTH / 2;
        this.y = player.y - this.SCREEN_HEIGHT / 2;
        this.destX = player.x + this.SCREEN_WIDTH / 2;
        this.destY = player.y + this.SCREEN_HEIGHT / 2;
    }

    update(player) {
        /* Set destination to follow */
        if(player.state == "SNIPE"){
        	this.dx = player.snipeX;
        	this.dy = player.snipeY;
        }
        else{
            this.dx = player.x;
            this.dy = player.y;
        }

        if (this.dx - this.x - this.SCREEN_WIDTH / 2 > 700) {
            this.x += this.MAP_WIDTH;
        }
        else if (this.x - this.dx + this.SCREEN_WIDTH / 2 > 700) {
            this.x -= this.MAP_WIDTH;
        }
        if (this.dy - this.y - this.SCREEN_HEIGHT / 2 > 700) {
            this.y += this.MAP_HEIGHT;
        }
        else if (this.y - this.dy + this.SCREEN_HEIGHT / 2 > 700) {
            this.y -= this.MAP_HEIGHT;
        }

        /* Chase the destination */
        this.x += (this.dx - this.x - this.SCREEN_WIDTH / 2) / 10;
        this.y += (this.dy - this.y - this.SCREEN_HEIGHT / 2) / 10;

        /* Just set to destination if it is close */
        if (Math.abs(this.x + this.SCREEN_WIDTH / 2 - this.dx) + Math.abs(this.y + this.SCREEN_HEIGHT / 2 - this.dy) <= 1) {
            this.x = this.dx - this.SCREEN_WIDTH / 2;
            this.y = this.dy - this.SCREEN_HEIGHT / 2;
        }

        /* Make position integer */
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }
}