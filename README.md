<p align="center">
  <img src="logo.png" alt="Webwire logo" width="130" height="130">
</p>
<h1 align="center">
  WebWire
</h1>
<p align="center">
  A tool capable of generating images of hand-drawn wireframes from real websites.
  <br>
  <strong>Developed by <a href="https://github.com/literallysofia">Sofia Silva</a></strong>
  <br>
  <br>
  <a href="https://www.typescriptlang.org">TypeScript</a>
  ·
  <a href="https://www.selenium.dev">Selenium</a>
  ·
  <a href="https://pptr.dev">Puppeteer</a>
  ·
  <a href="https://roughjs.com">RoughJS</a>
</p>

## Table of contents

- [Table of contents](#table-of-contents)
- [About](#about)
- [Status](#status)
- [Quick Start](#quick-start)
- [Run Individually](#run-individually)
  - [Inspector](#inspector)
  - [Render](#render)
    - [--font](#--font)
    - [--textblock](#--textblock)
    - [--realtext](#--realtext)
    - [--random](#--random)
    - [--roughness](#--roughness)
    - [--bowing](#--bowing)
    - [--stroke](#--stroke)
- [Structure](#structure)

## About

Dissertation project for the Master in Informatics and Computer Engineering (MIEIC) at the Faculty of Engineering of the University of Porto (FEUP).

**Concluded on:** July 23, 2020

## Status

[![Build Status](https://travis-ci.com/literallysofia/webwire.svg?token=7Dxk8WEiEdhDmmz21QEU&branch=master)](https://travis-ci.com/literallysofia/webwire)
[![BCH compliance](https://bettercodehub.com/edge/badge/literallysofia/webwire?branch=master&token=6240a7cb7e9aeec1e9e74cdea140f2cdc07bf083)](https://bettercodehub.com/)

## Quick Start

First, you must install Node, NPM, and TypeScript. Then, simply run the commands bellow to start WebWire.

```bash
$ npm install
$ npm run build
$ npm start
```

Examples of websites:

* https://getbootstrap.com/docs/4.5/examples/album/
* https://getbootstrap.com/docs/4.5/examples/jumbotron/
* https://getbootstrap.com/docs/4.5/examples/checkout/
* https://getbootstrap.com/docs/4.5/examples/carousel/
* https://getbootstrap.com/docs/4.5/examples/pricing/

When making changes to the Inspector's config file, mainly on the xpaths, you can see what changes in the ```data.json``` of the previous tested websites. A new file named ```data_new.json``` will be generated and compared to the original one.

```bash
$ npm run start:diff
```

## Run Individually

If you want to run WebWire the old fashion way, you can run each part individually. Keep in mind that this approach is per website and you must assing an ```id``` yourself.

### Inspector

```bash
$ npm run build
$ npm run inspector -- --id <website id> --src <website url>
```

### Render

```bash
$ npm run build
$ npm run render -- --src <json file> [options]
```

#### --font

When you want to set the font of the wireframe, you can run with the ```--font``` flag (or ```-f```). Keep it mind that it has to be a Google font.

```bash
$ npm run render -- --src generated/data.json --seed 2837465 --font "Indie Flower"
```

#### --textblock

When you want to set the style for all text blocks present in the wireframe, you can run with the ```--textblock``` flag (or ```-t```). The style can be **Text** or **Paragraph**.

```bash
$ npm run render -- --src generated/data.json --seed 2837465 --textblock "Paragraph"
```

#### --realtext

When you want the wireframe to display the website's real text for titles and links, you can run with the ```--realtext``` flag.

```bash
$ npm run render -- --src generated/data.json --seed 2837465 --realtext
```

#### --random

When you want to set the random offset of the wireframe, you can run with the ```--random``` flag.

```bash
$ npm run render -- --src generated/data.json --seed 2837465 --random 5
```

#### --roughness

When you want to set the roughness of the wireframe, you can run with the ```--roughness``` flag (or ```-r```).

```bash
$ npm run render -- --src generated/data.json --seed 2837465 --roughness 1.5
```

#### --bowing

When you want to set the bowing (how curvy the lines are when drawing) of the wireframe, you can run with the ```--bowing``` flag (or ```-b```).

```bash
$ npm run render -- --src generated/data.json --seed 2837465 --bowing 4
```

#### --stroke

When you want to set the width of the strokes of the wireframe, you can run with the ```--stroke``` flag (or ```-s```).

```bash
$ npm run render -- --src generated/data.json --seed 2837465 --stroke 2
```

## Structure

There are three files you can customize according to your needs:

* ```main.json``` is where you set the websites, for which the tool generates wireframes.
* ```config/inspector.yml``` is where you set which web elements you want to collect and the **Inspector** options.
* ```config/render.yml``` is where you set the **Render** default options.

Within the download you'll find the following directories and files. You'll see something like this:

```text
webwire/
├── main.json
├── config/
│   ├── inspector.yml
│   └── render.yml
└── src/
    ├── inspector/
    │   ├── browser.ts
    │   ├── config.ts
    │   ├── ielement.ts
    │   ├── index.ts
    │   ├── inspector.ts
    │   └── utils.ts
    └── render/
        ├── graphics/
        │   ├── burguer.ts
        │   ├── button.ts
        │   ├── buttontext.ts
        │   ├── checkbox.ts
        │   ├── container.ts
        │   ├── drawable.ts
        │   ├── drawabletext.ts
        │   ├── dropdown.ts
        │   ├── icon.ts
        │   ├── image.ts
        │   ├── paragraph.ts
        │   ├── radio.ts
        │   ├── text.ts
        │   ├── textfield.ts
        │   └── title.ts
        ├── config.ts
        ├── data.ts
        ├── export.ts
        ├── index.ts
        ├── render.ts
        └── utils.ts
```
