# Angular2 Instagram
[![Angular 2 Style Guide][angular2-style-guide-badge]][style-guide]
[![Dependency Status][dependency-badge]][dependency]
[![devDependency Status][devDependency-badge]][devDependency]
[![PRs Welcome][prs-badge]][prs]
[![MIT License][license-badge]][license]
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)

## Getting Started 
### Dependencies Prerequisites
> Make sure you have Node **version >= 6.9** and NPM **>= 3**
 
Once you have those, you should install these globals with `npm install --global`:

* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)

### Running Development
Once you have installed all prerequisites,

* `fork` this repo
* `clone` your fork
* `nvm use` use the node version from .nvmrc
* `npm install` to install all dependencies
* `npm start` to run our app locally in dev mode

### Running and building with Electron

* `npm run electron:dev` will start `webpack-dev-server` along with `electron` with hot reloading and devtools activated
* `npm run electron:prod` will first build the app following the standard production webpack pipeline, then it will copy `/package.json` and `/src/app/electron/electron.js` to the output `/public` directory and finally run `electron`. Webpack is not running in `--watch` mode so changes won't be rebuilt
* `npm run electron:package` will package the `electron` app in the `/dist` folder using `electron-packager`. By default it will build the app for the current OS and architecture. For example to target OS X 64bit explicitly: `npm run package -- --platform=mas --arch=x64`. For a [detailed list of all the available parameters click here](https://github.com/electron-userland/electron-packager/blob/master/usage.txt)

## Contributors
Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/1400300?v=3" width="100px;"/><br /><sub>Jay Kan</sub>](https://github.com/JayKan)<br />[💻](https://github.com/JayKan/Angular2-Instagram/commits?author=JayKan) [📖](https://github.com/JayKan/Angular2-Instagram/commits?author=JayKan) 💬 👀 | [<img src="https://avatars2.githubusercontent.com/u/680205?v=3" width="100px;"/><br /><sub>Yari</sub>](https://github.com/damnko)<br />[💻](https://github.com/JayKan/Angular2-Instagram/commits?author=damnko) | [<img src="https://avatars2.githubusercontent.com/u/12104589?v=3" width="100px;"/><br /><sub>Stefan Nieuwenhuis</sub>](https://stefannieuwenhuis.github.io/)<br />[💻](https://github.com/JayKan/Angular2-Instagram/commits?author=StefanNieuwenhuis) |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License
MIT © [Jay Kan](https://github.com/JayKan)

[build-status-badge]: https://img.shields.io/travis/JayKan/angular2-instagram.svg?style=flat-square
[build-status]: https://travis-ci.org/JayKan/angular2-instagram
[dependency-badge]: https://david-dm.org/JayKan/angular2-instagram/status.svg?style=flat-square
[dependency]: https://david-dm.org/JayKan/angular2-instagram
[devDependency-badge]: https://david-dm.org/JayKan/angular2-instagram/dev-status.svg?style=flat-square
[devDependency]: https://david-dm.org/JayKan/angular2-instagram?type=dev
[angular2-style-guide-badge]: https://mgechev.github.io/angular2-style-guide/images/badge.svg
[style-guide]: https://github.com/mgechev/angular2-style-guide
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: https://github.com/JayKan/angular2-instagram/pulls
[license-badge]: https://img.shields.io/npm/l/express.svg?style=flat-square
[license]: https://github.com/JayKan/angular2-instagram/blob/master/LICENSE
