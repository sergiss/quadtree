export default class Time {

    constructor() {
        this.lastTime = this.getCurrentMillis();
    }

    getCurrentMillis() {
        return new Date().getMilliseconds();
    }

    getDeltaTime() {
        const now = this.getCurrentMillis();
        const diff = now - this.lastTime;
        this.lastTime = now;
        if(diff === 0) return 0.001;
        return 1.0 / diff;
    }

}