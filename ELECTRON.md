# Running and building for Desktop with Electron
`Electron` makes it pretty easy to run `angular2-instagram` as desktop app. To create a standalone executable we're using two packages:

* `electron-builder`
* `electron-packager`

We're using both for educational purposes, a single one of those would suffice.

## Configure Electron
To configure `electron` we need to create an entry file that will be run when calling the `electron` command. You can [find it here](https://github.com/JayKan/angular2-instagram/blob/master/src/electron/electron.js) on `/src/app/electron/electron.js`.

## Running Electron on development and production mode
* `npm run electron:dev` will start `webpack-dev-server` along with `electron` with hot reloading and devtools activated
* `npm run electron:prod` will first build the app following the standard production webpack pipeline, then it will copy `/package.json` and `/src/app/electron/electron.js` to the output `/public` directory and finally run `electron`. Webpack is not running in `--watch` mode so changes won't be rebuilt

## Creating the standalone executable
This project uses both `electron-packager` and `electron-builder` to create the standalone app. Consider that you might need additional tools in order to package the app for multiple platforms using a single OS (eg. to package for Windows using Linux you will need Wine).

### Building and packaging with `electron-builder`
By running `npm run electron:builder` the app will be built in `production` mode with `webapack` and the resulting files under the `/public` folder will be packaged to create the standalone `electron` app. If no other parameter is set, the app will be packaged for the current OS and architecture (eg. macOS 64bit) and will be found under the `/dist` folder.
If you want, for example, pack the app for Windows 32bit you could do `npm run electron:builder -- -w --ia32`. If you want to build for all 64bit platforms you should run `npm run electron:builder -- -lwm --x64`.

The configuration that `electron-builder` uses to create the package is in the `build` section of `package.json`.
Following are some useful information to keep in mind:
* `appId` is a general name in the form of `com.electron.app-name`
* `category` is the category in which the app can be identified, [here is a list](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8) of possible categories
* `buildResources` is the folder where backgrounds and icons are stored: a `background.png` used as macOS DMG background, app icons in the form of `icon.icns` (macOS app icon) and `icon.ico` (Windows app icon) and the same icons in `.png` format named `24x24.png`, `32x32.png`, `48x48.png`, `64x64.png`, `128x128.png`, `256x256.png` each with the corresponding dimensions
* `files` is a list of files and folders to be packaged in the final app, defining them here also won't copy all the `node_modules` and `src` files
* `linux` is just an example to show you can define specific target images/formats for the packaged app

There is much more to it, for full documentation and examples here are some useful links:
* [electron-builder](https://github.com/electron-userland/electron-builder)
* [electron-builder build options](https://github.com/electron-userland/electron-builder/wiki/Options)
* [push app updates with electron-builder](https://github.com/electron-userland/electron-builder/wiki/Auto-Update)

### Building with `electron-packager`
By running `npm run electron:packager` the following steps will happen:
1. the app will be built in `production` mode with `webpack`
2. the `electron.js` configuration file will be copied with its folder structure inside `/public` folder
3. `electron-packager` will package all the contents of the `/public` folder and create an executable file under the `/dist/...` folder

If no other parameter is set, the app will be packaged for the current OS and architecture (eg. macOS 64bit). To packager for multiple OS and architecture you can use the `--platform=<platform>` and `--arch=<arch>` respectively.

* For a [full documentation](https://github.com/electron-userland/electron-packager) please refer to the `electron-packager` Github page.
* For a [detailed list of all the available parameters click here](https://github.com/electron-userland/electron-packager/blob/master/usage.txt)

## Publishing the executable on Github, Amazon S3...
We are using `electron-builder` via the script `npm run electron:publish` command to create a `release` in the `angular2-instagram` repository and attach the standalone desktop app.
This is the step by step process we follow:
1. first [created a Github token with repo access](https://github.com/settings/tokens/new)
2. locally set the env variable with eg. `export GH_TOKEN="<TOKEN_HERE>"`
3. update the `version` in `package.json`, this will also be the name (prepended with a `v` eg. `0.0.2` will become `v0.0.2`) of the `release` that will be created in Github
4. run `npm run electron:publish`
5. go to the Github release section of the repository, edit the description and title of the release and publish it, since it was initially created by `electron-builder` as a `draft`

For more info on programmatically publishing the executable on other sources you can have a look at the [official documentation on electron-builder](https://github.com/electron-userland/electron-builder/wiki/Publishing-Artifacts).

----------

*The packaging process has been tested for now only on Linux Mint 64bit.*