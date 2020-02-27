# Improving Synthetic Datasets for Automatic Website Generation from Wireframes

Thesis project for the Master in Informatics and Computer Engineering (MIEIC).

**Author:** Sofia Silva

**Institution:** Faculty of Engineering of the University of Porto (FEUP)

**Supervisor:** André Restivo

**Second Supervisor:** Hugo Sereno Ferreira

## Instructions

Please, make sure you have node, npm, and typescript installed.

```bash
$ npm install
$ npm run build
$ npm start <url> [html tags]
```

**Examples**

```bash
$ npm start https://v4-alpha.getbootstrap.com/examples/album/ img
$ npm start https://v4-alpha.getbootstrap.com/examples/album/ img a button
$ npm start https://getbootstrap.com/docs/4.4/examples/floating-labels/ input img p button
$ npm start https://getbootstrap.com/docs/4.4/examples/checkout/ input
$ npm start https://getbootstrap.com/docs/4.4/examples/pricing/ a button h1 h4 h5 p
```

--config config.yml