# Rebirth

Awesome front-end starter kit and opinionated styleguide for developing responsive, mobile first projects on the web. Everytime you start a new project with Rebirth it is meant to be modified to your project needs. The idea behind Rebirth is not to be a framework but a starting point with predefined HTML, CSS and JavaScript recipes. 
 
Inspired by methods and ideas from various sources such as [SUIT CSS](https://github.com/suitcss/suit), [BEM](https://bem.info/), [INUITCSS](https://github.com/inuitcss), [SMACSS](https://smacss.com/), [OOCSS](http://oocss.org/) and [Bootstrap](http://getbootstrap.com). 

## Requirements

* [SASS](http://sass-lang.com/)
* [Babel](https://babeljs.io/) or similar ES2015 syntax transformer
* [Browserify](http://browserify.org/) or [Webpack](https://webpack.github.io/)

## Getting started

Read the [CSS styleguide](docs/css) and [JavaScript styleguide](docs/js) so you know how to build with Rebirth.

### a) Create a new project

Preferred way to start a new Rebirth project is together with [generator-rebirth](https://github.com/joonasy/generator-rebirth.git) which installs Rebirth and can scaffold new [WordPress](wordpress.org), [TYPO3](https://typo3.org/) or [HTML](https://github.com/assemble/assemble/) projects with development environment.

Head to [Rebirth Yeoman generator](https://github.com/joonasy/generator-rebirth.git) and get started!

### b) Install

You can also install Rebirth directly with npm:

```
npm install rebirth
```

## Usage (Work in progress!)

### Generator

You can create new components with the [Rebirth Yeoman generator](https://github.com/joonasy/generator-rebirth.git):

```
yo rebirth component:foo
```

This will copy component dependencies (SCSS and JavaScript files) which you can start modifying. Head to [Rebirth Yeoman generator](https://github.com/joonasy/generator-rebirth.git) for more information about the generator usage.

### SASS

If you use Rebirth without the generator you can also import all the SCSS files:

```
import 'rebirth/src/assets/app';
```

You can also import components explicitly. To start with a full list of modules copy _app.scss file into your project and comment out components you do not want. 

### CSS

If you only want all the compiled and minified CSS:

```
<link rel="stylesheet" href="rebirth/dist/app.min.css">
```

## Documentation

* [CSS styleguide](docs/css)
* [JavaScript styleguide](docs/css)

## Contribute

**Work in progress!** Use only if you know what you are doing or you are working together with the author. All docs are currently very much outdated.

Please discuss about new ideas and things that you think should be modified. Currently all the styleguiding, components (CSS/JS) and generator logic has been made by Joonas Ylitalo [@joonasy](https://twitter.com/joonasy).

[Learn more about contributing](docs/contribute.md)

## Todo (in random order)

* Apply new structural changes to docs
* Publish and finish the documentation
* All necessary CSS components
* CSS modular scale
* Testing for JavaScript
* Consider removing jQuery

## License

Copyright (c) 2017 Joonas Ylitalo (Twitter: @joonasy) Licensed under the MIT license.
