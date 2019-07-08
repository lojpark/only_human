class Robots {
    constructor(map, context) {
        this.map = map;
        this.context = context;

        this.robots = {};
    }

    update(packedRobots) {
        // Remove unremoved players
        for (let id in this.robots) {
            let isExist = false;
            for (let j = 0; j < packedRobots.length; j++) {
                if (id == packedRobots[j].id) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                delete this.robots[id];
            }
        }

        // Update robots
        for (let i = 0; i < packedRobots.length; i++) {
            if (this.robots[packedRobots[i].id] == null) {
                this.robots[packedRobots[i].id] = new Robot(packedRobots[i].x, packedRobots[i].y, 1, this.map, this.context);
            }
            else {
                this.robots[packedRobots[i].id].x = packedRobots[i].x;
                this.robots[packedRobots[i].id].y = packedRobots[i].y;
                this.robots[packedRobots[i].id].dir = packedRobots[i].dir;
                this.robots[packedRobots[i].id].state = packedRobots[i].state;
                this.robots[packedRobots[i].id].motion = packedRobots[i].motion;
            }
        }
    }

    print(screen) {
        for (let i in this.robots) {
            this.robots[i].print(screen);
        }
    }
}