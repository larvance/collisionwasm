import init, {check_collision} from "./pkg/collisionwasm.js";

await init();

export {check_collision as checkCollisionRaw} from "./pkg/collisionwasm.js";

export class Sprite {
    static placeholder;

    static fromPath(src, scale = 1, smooth = false) {
        const sprite = new Sprite;
        const img = new Image();
        img.src = src;
        sprite.waiter = new Promise(r => img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.imageSmoothingEnabled = smooth;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            sprite.source = canvas;
            sprite.data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            r(sprite);
        });
        return sprite;
    };

    static fromImage(image, scale = 1, smooth = false) {
        const sprite = new Sprite;

        if (image instanceof HTMLCanvasElement || image instanceof OffscreenCanvas) {
            sprite.source = image;
            sprite.data = image.getContext("2d").getImageData(0, 0, image.width, image.height);
            return sprite;
        }

        const canvas = document.createElement("canvas");
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = smooth;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        sprite.source = canvas;
        sprite.data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return sprite;
    };

    static fromData(data, height) {
        const sprite = new Sprite;

        if (data instanceof Uint8Array) data = data.buffer;
        if (data instanceof ArrayBuffer) data = new Uint8ClampedArray(data);
        if (data && "_isBuffer" in data && data._isBuffer) data = new Uint8ClampedArray(data.buffer || data, data.byteOffset, data.length);
        if (data instanceof Uint8ClampedArray) data = new ImageData(data, data.length / (height * 4), height);

        if (data instanceof ImageData) sprite.data = data;

        return sprite;
    };

    waiter = null;
    source = null;
    data = null;

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

    transform(scaleX = 1, scaleY = 1, rotate = 0, smooth = false) {
        if (scaleX === 1 && scaleY === 1 && rotate === 0) return this;
        if (scaleX === 0 || scaleY === 0) throw new Error("Scale cannot be zero");
        if (!this.data) {
            this.waiter = this.waiter.then(() => this.transform(scaleX, scaleY, rotate, smooth));
            return this;
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = smooth;

        canvas.width = this.data.width * scaleX;
        canvas.height = this.data.height * scaleY;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotate !== 0) ctx.rotate(rotate);
        if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY);
        this.ensureSource();
        ctx.drawImage(this.source, -this.data.width / 2, -this.data.height / 2);

        this.source = canvas;
        this.data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return this;
    };

    scale(scaleX = 1, scaleY = 0, smooth = false) {
        return this.transform(scaleX, scaleY || scaleX, 0, smooth);
    };

    rotate(angle, smooth = false) {
        return this.transform(1, 1, angle, smooth);
    };

    ensureSource() {
        if (!this.source) {
            const temp = document.createElement("canvas");
            temp.width = this.data.width;
            temp.height = this.data.height;
            temp.getContext("2d").putImageData(this.data, 0, 0);
            this.source = temp;
        }
        return this.source;
    };

    draw(ctx, x, y) {
        if (this.source) ctx.drawImage(this.source, x, y, this.source.width, this.source.height);
        else if (this.data) ctx.putImageData(this.data, x, y);
        return this;
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

    clone() {
        const sprite = new Sprite;
        sprite.source = this.source;
        sprite.data = this.data;
        return sprite;
    };

    set(sprite) {
        if (!(sprite instanceof Sprite)) throw new Error("Sprite must be an instance of Sprite");
        this.source = sprite.source;
        this.data = sprite.data;
        return this;
    };

    collidesWith(other, selfX, selfY, otherX, otherY, alphaThreshold = 0.5) {
        if (!(other instanceof Sprite)) throw new Error("Other must be an instance of Sprite");
        return Sprite.checkCollision(this, selfX, selfY, other, otherX, otherY, alphaThreshold);
    };

    static checkCollision(self, selfX, selfY, other, otherX, otherY, alphaThreshold = 0.5) {
        if (!(self instanceof Sprite) || !(other instanceof Sprite) || !self.data || !other.data) return false;
        alphaThreshold = Math.round(Math.min(1, Math.max(0, alphaThreshold)) * 255);
        return check_collision(
            self.data.data, self.data.width, self.data.height, selfX, selfY,
            other.data.data, other.data.width, other.data.height, otherX, otherY, alphaThreshold
        );
    };
}

const placeholder = document.createElement("canvas");
placeholder.width = 1;
placeholder.height = 1;
Sprite.placeholder = Sprite.fromImage(placeholder);