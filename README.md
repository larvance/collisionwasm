# CollisionWASM

Pixel-perfect collision detection in the browser using WebAssembly.

## Installation

```bash
npm install collisionwasm
```

## Usage

You can check the demo in the `demo/` folder or
at [https://larvance.com/collisionwasm/demo/](https://larvance.com/collisionwasm/demo/).

First import the `Sprite` class from the package:

```js
import {Sprite} from "collisionwasm";
```

### Creating a Sprite

If you have the path or the URL of the sprite image, you can create a `Sprite` instance like this:

```js
const sprite = Sprite.fromPath("./sprite.png");

// Since it takes time to load the image from an external source,
// you can use the `wait` method to wait for the image to be loaded.
// If you render immediately, it will just render a blank sprite.
// Although if you render inside a `requestAnimationFrame` loop, it will work fine.
await sprite.wait();
```

If you have an `Image` or `Canvas` instance you can create a `Sprite` instance like this:

```js
const sprite = Sprite.fromImage(image);
```

If you have an `ImageData` instance you can create a `Sprite` instance like this:

```js
const sprite = Sprite.fromData(imageData);
```

### Rendering a Sprite

You can simply use the `draw` method to render the sprite on a `CanvasRenderingContext2D`:

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let x = 100, y = 100;

sprite.draw(ctx, x, y);
```

### Collision Detection

To check if two sprites are colliding, you can use the `collidesWith` method:

```js
const sprite1 = Sprite.fromPath("./sprite1.png");
const sprite2 = Sprite.fromPath("./sprite2.png");

await Promise.all([sprite1.wait(), sprite2.wait()]);

const isColliding = sprite1.collidesWith(sprite2, x1, y1, x2, y2);

if (isColliding) {
    console.log("Sprites are colliding!");
} else {
    console.log("Sprites are not colliding.");
}
```