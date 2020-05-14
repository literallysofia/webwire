<h1 align="center">
  WebWire
</h1>
<p align="center">
A tool capable of generating images of hand-drawn wireframes from real websites.<br/>Built with <a href="https://www.typescriptlang.org" target="_blank">TypeScript</a>, <a href="https://www.selenium.dev" target="_blank">Selenium</a>, <a href="https://pptr.dev" target="_blank">Puppeteer</a>, and <a href="https://roughjs.com" target="_blank">RoughJS</a>
</p>
<p align="center">
  <strong>Developed by
  <a href="https://github.com/literallysofia" target="_blank">Sofia Silva</a>
  </strong>
</p>
<p align="center">
  <a href="https://bettercodehub.com/" target="_blank">
    <img src="https://bettercodehub.com/edge/badge/literallysofia/feup-diss?branch=master&token=fe9608ed80cf9ba6a124bf6fe3c5f8eff18316c5" alt="BCH compliance" />
  </a>
</p>

## About

Dissertation project for the Master in Informatics and Computer Engineering (MIEIC) at the Faculty of Engineering of the University of Porto (FEUP).

**Concluded on:** July 2020

## Configuration

There are three files you can customize according to your needs:

* ```main.json``` is where you set the websites, for which the tool generates wireframes.
* ```config/inspector.json``` is where you set which web elements you want to collect and the **Inspector** options.
* ```config/render.json``` is where you set the **Render** default options.

## Installation

First, you must install Node, NPM, and TypeScript. Then, simply run the commands bellow to start WebWire.

```bash
$ npm install
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
$ npm run diff
```

## Step By Step

If you want to run WebWire the old fashion way.

### Inspector

```bash
$ npm run build
$ npm run inspector -- --id <website id> --src <website url>
```

### Render

```bash
$ npm run build
$ npm run render -- --src <json file> --seed <random seed> [options]
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