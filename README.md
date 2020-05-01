<h1 align="center">
  WebWire
</h1>
<p align="center">
A tool capable of generating images of hand-drawn wireframes from real websites. Built with <a href="https://www.typescriptlang.org" target="_blank">TypeScript</a>, <a href="https://www.selenium.dev" target="_blank">Selenium</a>, <a href="https://pptr.dev" target="_blank">Puppeteer</a>, and <a href="https://roughjs.com" target="_blank">RoughJS</a>
</p>
<p align="center">
  <strong>Developed by
  <a href="https://github.com/bchiang7/v1" target="_blank">Sofia Silva</a>
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

* https://getbootstrap.com/docs/4.4/examples/album/
* https://getbootstrap.com/docs/4.4/examples/jumbotron/
* https://getbootstrap.com/docs/4.4/examples/checkout/
* https://getbootstrap.com/docs/4.4/examples/blog/
* https://getbootstrap.com/docs/4.4/examples/cover/
* https://getbootstrap.com/docs/4.4/examples/sign-in/
* https://getbootstrap.com/docs/4.4/examples/carousel/
* https://getbootstrap.com/docs/4.4/examples/pricing/
* https://getbootstrap.com/docs/4.4/examples/product/
