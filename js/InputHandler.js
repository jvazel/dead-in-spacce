export class InputHandler {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', e => {
            if (e.code === 'AltLeft' || e.code === 'AltRight') e.preventDefault();
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', e => this.keys[e.code] = false);
    }
    isDown(code) { return !!this.keys[code]; }
}
