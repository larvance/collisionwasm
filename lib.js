import init, {check_collision} from "./pkg/collisionwasm.js";

await init();

export {check_collision as checkCollisionRaw} from "./pkg";

export function loadImage(src, scale = 1, smoothing = false) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = smoothing;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas);
        }
        img.onerror = reject;
    });
}

export class Sprite {
    static async loadImage(data, scale = 1, smoothing = false) {
        const img = await loadImage(data, scale, smoothing);
        return new Sprite(img);
    };

    constructor(data, height) {
        this.waiter = null;
        this.source = null;
        this.setData(data, height);
    };

    get width() {
        if (!this.data) return 0;
        return this.data.width;
    };

    get height() {
        if (!this.data) return 0;
        return this.data.height;
    };

    wait() {
        return this.waiter;
    };

    setData(data, height) {
        if (typeof data === "string") {
            return this.waiter = loadImage(data).then(img => this.setData(img, height));
        }

        if (data instanceof Sprite) {
            this.source = data.source;
            return this.data = data.data;
        }

        if (data instanceof Image || data instanceof ImageBitmap) {
            const canvas = document.createElement("canvas");
            const scale = height ? height / data.height : 1;
            canvas.width = data.width * scale;
            canvas.height = data.height * scale;
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(data, 0, 0, canvas.width, canvas.height);
            this.source = canvas;
            return this.data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        if (data instanceof HTMLCanvasElement || data instanceof OffscreenCanvas) {
            this.source = data;
            return this.data = data.getContext("2d").getImageData(0, 0, data.width, data.height);
        }

        if (data instanceof Uint8Array) data = data.buffer;
        if (data instanceof ArrayBuffer) data = new Uint8ClampedArray(data);
        if (data && "_isBuffer" in data && data._isBuffer) data = new Uint8ClampedArray(data.buffer || data, data.byteOffset, data.length);

        if (data instanceof Uint8ClampedArray) {
            if (typeof height !== "number") throw new Error("Height must be specified for Uint8Array data");
            return this.data = new ImageData(new Uint8ClampedArray(data), data.length / (height * 4), height);
        }

        if (data instanceof ImageData) return this.data = data;

        throw new Error("Unsupported data type for Sprite: " + (data && data.constructor ? data.constructor.name : typeof data));
    };

    draw(ctx, x, y) {
        if (this.source) ctx.drawImage(this.source, x, y, this.source.width, this.source.height);
        else if (this.data) ctx.putImageData(this.data, x, y);
    };

    getPixel(x, y) {
        if (!this.data) return {r: 0, g: 0, b: 0, a: 0};
        const index = (y * this.data.width + x) * 4;
        return {
            r: this.data.data[index],
            g: this.data.data[index + 1],
            b: this.data.data[index + 2],
            a: this.data.data[index + 3]
        };
    };

    checkCollision(other, selfX, selfY, otherX, otherY) {
        if (!(other instanceof Sprite)) throw new Error("Other must be an instance of Sprite");
        return Sprite.checkCollision(this, selfX, selfY, other, otherX, otherY);
    };

    static checkCollision(self, selfX, selfY, other, otherX, otherY) {
        if (!(self instanceof Sprite) || !(other instanceof Sprite) || !self.data || !other.data) return false;
        console.log(1)
        return check_collision(
            self.data.data, self.data.width, self.data.height, selfX, selfY,
            other.data.data, other.data.width, other.data.height, otherX, otherY
        );
    };
}