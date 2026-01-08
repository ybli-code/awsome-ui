# Colored Glowing Edge Card

A Pen created on CodePen.

Original URL: [https://codepen.io/ybli-code/pen/QwEEEbM](https://codepen.io/ybli-code/pen/QwEEEbM).

This is _somewhat different_ to the usual colored, glowing cards you may have seen before!

Building off my [previous Codepen (Gradient Pulse)](https://codepen.io/simeydotme/pen/QwjEgmq), I wanted to create a card with glowing edges, and a subtle coloured border.

I'm using **a mesh gradient background**, which is masked with radial gradients to create the edge colors. Then it's _masked again with a conic-gradient that follows the direction of the pointer_. The glow increases in opacity as the pointer gets closer to the edge.

This effect feels a lot better in my opinion, than a simple radial-gradient mask that follows the pointer, as the glow is stuck to the edge more naturally.