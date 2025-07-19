export {check_collision as checkCollisionRaw} from "./pkg";

export function loadImage(src: string, scale?: number): Promise<HTMLCanvasElement>;

export class Sprite {
    data: string | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas | Sprite
        | ImageBitmap | ImageData | Uint8Array | ArrayBuffer | Uint8ClampedArray;

    static loadImage(src: string, height?: number): Promise<Sprite>;

    constructor(data: string | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas | Sprite | ImageBitmap | ImageData);
    constructor(data: Uint8Array | ArrayBuffer | Uint8ClampedArray, height: number);

    readonly width: number;
    readonly height: number;
    readonly source: HTMLImageElement | ImageBitmap | HTMLCanvasElement | OffscreenCanvas | null;

    wait(): Promise<this["data"]>

    setData(data: string | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas | Sprite | ImageBitmap | ImageData): void;
    setData(data: Uint8Array | ArrayBuffer | Uint8ClampedArray, height: number): void;

    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;

    getPixel(x: number, y: number): { r: number, g: number, b: number, a: number };

    checkCollision(other: Sprite, selfX: number, selfY: number, otherX: number, otherY: number): boolean;

    static checkCollision(self: Sprite, other: Sprite, selfX: number, selfY: number, otherX: number, otherY: number): boolean;
}