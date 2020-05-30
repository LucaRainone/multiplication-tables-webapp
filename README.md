## What
This is a simple multiplication table quiz web app. Born as PWA playable offline.

[Demo](https://www.rain1.it/tabelline/)

## Why
Because I have a son who is in 2nd elementary school and I wanted to build something for him without annoying ad.

## Contributing

Fixes and contributions are welcome

### Translations

inside the `src/js/locale` there are the localized files. Get as template the it.js file and add your {langCode}.js file.

In order to see and build a localized version of the app, the only way is to modify the `src/js/locale/default.js` file
replacing the name of locale file (`it.js`);

### To set up the development environment
For basic integrations you have to do nothing. Just clone this repo and open the `src/index.html` with a modern
browser. The main app works without need of compilation step.

The only exception is the service worker, built upon the workbox framework. At the time of writing the ES6 modules are
not supported natively in service worker.

For advanced development you have to start a basic http server and run the source watcher.

After the classic `npm install`, run the `npm start` for build the source inside the `dist` folder and start the server at 
localhost:9981 (9x9=81). Then in another console, run `gulp watch` (or `npm run watch`) and start coding. 
Test your app on http://localhost:9981/dist/index.html

### Build from source only

Just run `npm run build`


