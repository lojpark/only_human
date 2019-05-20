class Weapon{
    constructor(context) {
        this.context = context;

        this.image = new Image();
        this.image.src = "../client/image/weapon.png";
    }

    print(x, y, state, mRun, mUp, mDown) {
        // Save the canvas
        this.context.save();

        // Create temporary variables to print
        const w = 100;
        const h = 20;
        let angle = 0;

        y += 20;

        // Jump motion
        if (state == "JUMP") y += 2;
        // Sit motion
        else if (state == "SIT" || state == "SNIPE") y += 8;
        // Run motion
        else {
            if (mRun % 2 == 1) y++;
            if (mRun == 2 || mRun == 6) y += 2;
        }

        // Aim up motion
        if (mUp == 1) {
            x += 1;
            y -= 2;
            angle = -10;
        }
        if (mUp == 2) {
            x += 1;
            y -= 3;
            angle = -24;
        }
        if (mUp == 3) {
            x += 1;
            y -= 3;
            angle = -75;
        }
        // Aim down motion
        if (mDown == 1) {
            x += 1;
            y += 1;
            angle = 15;
        }
        if (mDown == 2) {
            y += 2;
            angle = 45;
        }
        if (mDown == 3) {
            x -= 1;
            y += 2;
            angle = 75;
        }

        // Rotate the canvas
        this.context.translate((x + 16), (y + 6));
        this.context.rotate(angle * Math.PI / 180);
        this.context.translate((x + 16) * -1, (y + 6) * -1);

        // Print image
        context.drawImage(this.image, w * 1, h * 3, w, h, x, y, w / 2, h / 2);

        // Restore the canvas
        context.restore();
    }
}