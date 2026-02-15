<div align="">
    <h1>Versoly Marquee</h1>
    <p>A simple and small JS library to create marquee animations</p>
    <ul>
        <li>1.1 KB</li>
        <li>Stop animation on hover</li>
        <li>Speed control</li>
    </ul>
    <p>
        <a href="https://discord.versoly.com"><img src="https://flat.badgen.net/badge/icon/discord?icon=discord&label" alt="Discord"></a>
        <a href="https://github.com/versoly/versoly-marquee/tree/main?tab=MIT-1-ov-file"><img src="https://img.shields.io/badge/license-MIT-blue" alt="Licenese"></a>
        <a href="https://bundlephobia.com/result?p=versoly-marquee">
            <img src="https://flat.badgen.net/bundlephobia/minzip/versoly-marquee?icon=packagephobia&label&color=blue&cache=10800" alt="gzip bundle size">
        </a>
    </p>
</div>

---

[![Versoly - Tailwind page builder](public/versoly.png)](https://versoly.com/tailwind-page-builder?utm_source=github&utm_medium=repo&utm_campaign=image&utm_term=versoly-marquee)

## Getting started

Versoly marquee can be installed using npm, pnpm, CDNs. It is also tiny so you could just copy paste it onto a landing page for improved page speed.

### Install versoly-marquee package

```js
npm install versoly-marquee --save
```

### import versoly-marquee package

```js
import { Marquee } from "versoly-marquee";

// add data-toggle="marquee"
document.querySelectorAll('[data-toggle="marquee"]').forEach((elem) => {
  // set options on the element using data-options="{'duration': 10, 'direction': 'rtl'}"
  let t = elem.dataset.options || "{}";
  // parse data-options using replace for security instead of eval
  let options = JSON.parse(t.replaceAll("'", '"'));
  // add Marquee animation
  const marquee = new Marquee(elem, options);
});
```

### CDN

```html
<script src="https://unpkg.com/versoly-marquee@1/dist/versoly-marquee.iife.js"></script>
```

## Frequently Asked Questions

### Why create Versoly Marquee

It shouldn't require custom JS and re-inventing the wheel every time to add the same features to landing pages and marketing sites.

By default if you want a marquee you should use versoly-marquee, and only if it doesn't fit your use case to build it yourself.

### Why not just use CSS?

Versoly Marquee was built to be used in Versoly page builder + CMS and other headless CMSs, this means that non-technical users would be changing content that would effect the CSS required to make it work.

There is no way to only use CSS to create a marquee that isn't a fixed width.

### Why not use a slider library?

Slider libraries are usually 20-100x bigger than versoly-marquee, 99% of the features aren't needed.

## Roadmap

- Responsive options
- Plugins. On scroll, on mouse over.
- Vue/React and other JS frameworks

## Community

If you need help or just want to discuss about the library join the community on Github:

[Discuss on GitHub](https://github.com/versoly/versoly-marquee/discussions)

For casual chatting with others using the library:

[Join the Versoly Discord Server](https://discord.versoly.com)

## Changelog

#### v1.1.0

- Fix reduce elements created
- Add use observer to pause animation when not in viewport
- Add destroy method to clean up event listeners and intervals
- Upgrade to Vite 8 beta
- Upgrade to Typescript
- Add oxfmt and oxlint
