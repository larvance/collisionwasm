# collisionwasm

Pixel-perfect collision detection in the browser using WebAssembly.

## Installation

```bash
npm install collisionwasm
```

## Usage

```js
import {Sprite} from "collisionwasm";

const sprite = new Sprite("./sprite.png"); // Optionally you can give in the height of the sprite as the second argument

await sprite.wait(); // Since a path was given, we need to wait for the image to load

// Or you can just use the loadImage method
const mario = await Sprite.loadImage("./mario.png", 25);
const goomba = await Sprite.loadImage("./goomba.png", 25);

// The coordinates are the top-left corner of the sprite, the rest is handled by the library
// This will check every pixel and find if any of them overlap in an opaque pixel
const collision = mario.checkCollision(goomba, marioX, marioY, goombaX, goombaY);

if (collision) {
    console.log("Collision detected!");
} else {
    console.log("No collision.");
}
```