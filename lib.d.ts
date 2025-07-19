export {check_collision as checkCollisionRaw} from "./pkg/collisionwasm";

type ImageSource = HTMLImageElement | ImageBitmap | HTMLCanvasElement | OffscreenCanvas;
type ImageDataSource = ImageData | Uint8Array | Uint8ClampedArray | BufferSource;

export class Sprite {
    readonly data: ImageData;
    readonly source: ImageSource | null;

    static fromPath(src: string, scale?: number, smooth?: boolean): Sprite;

    static fromImage(img: ImageSource, scale?: number, smooth?: boolean): Sprite;

    static fromData(data: ImageDataSource, height: number): Sprite;

    readonly width: number;
    readonly height: number;

    wait(): Promise<this>;

    transform(scaleX?: number, scaleY?: number, rotate?: number, smooth?: boolean): this;

    scale(scaleX: number, scaleY?: number, smooth?: boolean): this;

    rotate(angle: number, smooth?: boolean): this;

    draw(ctx: CanvasRenderingContext2D, x: number, y: number): this;

    getPixel(x: number, y: number): { r: number, g: number, b: number, a: number };

    clone(): Sprite;

    set(sprite: Sprite): this;

    collidesWith(other: Sprite, selfX: number, selfY: number, otherX: number, otherY: number): boolean;

    static checkCollision(self: Sprite, other: Sprite, selfX: number, selfY: number, otherX: number, otherY: number): boolean;
}