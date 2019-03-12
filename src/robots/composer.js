class RobotsComposer {
    constructor({ robots = [], data = [] }) {
        this.robots = robots;
        this.data   = data
    }

    async run() {
        for (let robot of this.robots) {
            this.data = await robot.run({ data: this.data });
        }

        return this.data;
    }
}

module.exports = RobotsComposer;