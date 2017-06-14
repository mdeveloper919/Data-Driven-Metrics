# FAQ

1. [Why does this exist?](#why-does-this-exist)
2. [What do the scripts in package.json do?](#what-do-the-scripts-in-packagejson-do)
3. [Can you explain the folder structure?](#can-you-explain-the-folder-structure)
4. [What are the dependencies in package.json used for?](#what-are-the-dependencies-in-packagejson-used-for)
5. [Where are the files being served from when I run npm start?](#where-are-the-files-being-served-from-when-i-run-npm-start)
6. [Where is index.html?](#where-is-indexhtml)
7. [How is Sass being converted into CSS and landing in the browser?](#how-is-sass-being-converted-into-css-and-landing-in-the-browser)
8. [I don't like the magic you just described above. How do I use a regular CSS file?](https://github.hpe.com/daniel-eagle/UxUi-PageMill/blob/template-improvements/docs/FAQ.md#i-dont-like-the-magic-you-just-described-above-how-do-i-use-a-regular-css-file)
9. [Do I have to use Redux?](#do-i-have-to-use-redux)
10. [How do I remove React Router?](#how-do-i-remove-react-router)
11. [How do I deploy this?](#how-do-i-deploy-this)
12. [Why are test files placed alongside the file under test (instead of centralized)?](#why-are-test-files-placed-alongside-the-file-under-test-instead-of-centralized)
13. [How do I debug?](#how-do-i-debug)
14. [Why does the build use npm scripts instead of Gulp or Grunt?](#why-does-the-build-use-npm-scripts-instead-of-gulp-or-grunt)
15. [Why does package.json reference the exact version?](#why-does-packagejson-reference-the-exact-version)
16. [How do I handle images?](#how-do-i-handle-images)
17. [I'm getting an error when running npm install: Failed to locate "CL.exe", how do I resolve this?](#im-getting-an-error-when-running-npm-install-failed-to-locate-clexe-how-do-i-resolve-this)
18. [I can't access the external URL for Browsersync, what do I do?](#i-cant-access-the-external-url-for-browsersync-what-do-i-do)
19. [What about the Redux Devtools?](#what-about-the-redux-devtools)
20. [Hot reloading isn't working! How do I fix this?](#hot-reloading-isnt-working-how-do-i-fix-this)
21. [How do I setup code coverage reporting?](#how-do-i-setup-code-coverage-reporting)
22. [What options do I have for branding?](#what-options-do-i-have-for-branding)
23. [I don't like any of the layouts. What should I consider when implementing my own?](#i-dont-like-any-of-the-layouts-what-should-i-consider-when-implementing-my-own)
24. [What happens to my application if the layouts, templates, or other included UI components change?](#what-happens-to-my-application-if-the-layouts-templates-or-other-included-ui-components-change)
25. [Am I able to use PageMill to write backend services?](#am-i-able-to-use-pagemill-to-write-backend-services)
26. [How do I configure the app to be isomorphic and render React components on the server instead of the client?](#how-do-i-configure-the-app-to-be-isomorphic-and-render-react-components-on-the-server-instead-of-the-client)
27. [How do I make AJAX calls?](#how-do-i-make-ajax-calls)
28. [How do I use Express or hapi.js as a production web server?](#how-do-i-use-express-or-hapijs-as-a-production-web-server)
29. [How do I handle 404 errors?](#how-do-i-handle-404-errors)


## Why does this exist?

PageMill implements best practices like testing, minification, bundling, and so on. It codifies a long list of decisions that you no longer have to make to get rolling. It saves you from the long, painful process of wiring it all together into an automated dev environment and build process. It's also useful as inspiration for ideas you might want to integrate into your current development environment or build process.

## What do the scripts in package.json do?

Unfortunately, scripts in package.json can't be commented inline because the JSON spec doesn't support comments, so info is provided here on what each script in package.json does.

| **Script** | **Description** |
|----------|-------|
| prestart | Runs automatically before start. Calls remove-dist script which deletes the dist folder. This helps remind you to run the build script before committing since the dist folder will be deleted if you don't. ;) |
| start | Runs tests, lints, starts dev webserver, and opens the app in your default browser. |
| lint:tools | Runs ESLint on build related JS files. (eslint-loader lints src files via webpack when `npm start` is run) |
| clean-dist | Removes everything from the dist folder. |
| remove-dist | Deletes the dist folder. |
| create-dist | Creates the dist folder and the necessary subfolders. |
| prebuild | Runs automatically before build script (due to naming convention). Cleans dist folder, builds html, and builds sass. |
| build | Bundles all JavaScript using Webpack and writes it to /dist. |
| test | Runs tests (files ending in .spec.js) using Mocha and outputs results to the command line. Watches all files so tests are re-run upon save. |
| test:cover | Runs tests as described above. Generates a HTML coverage report to ./coverage/index.html |

## Can you explain the folder structure?

```
.
├── .babelrc                  # Configures Babel
├── .editorconfig             # Configures editor rules
├── .eslintrc                 # Configures ESLint
├── .gitignore                # Tells git which files to ignore.
├── .istanbul.yml             # Configure istanbul code coverage.
├── .npmrc                    # Configures npm to save exact by default.
├── README.md                 # The standard readme file.
├── dist                      # Folder where the build script places the built app. Use this in prod.
├── package.json              # Package configuration. The list of 3rd party libraries and utilities.
├── src                       # Source code
│   ├── actions               # Flux/Redux actions. List of distinct actions that can occur in the app.  
│   ├── components            # React components
│   ├── constants             # Application constants including constants for Redux.
│   ├── containers            # Top-level React components that interact with Redux.
│   ├── index.html            # Start page
│   ├── index.js              # Entry point for your app
│   ├── reducers              # Redux reducers. Your state is altered here based on actions.
│   ├── routes                # Route configuration for react-router.
│   ├── store                 # Redux store configuration
│   └── styles                # CSS Styles, typically written in Sass.
│   ├── utils                 # Plain old JS objects (POJOs). Pure logic. No framework specific code here.
├── tools                     # Node scripts that run build related tools
│   ├── build.js              # Runs the production build
│   ├── buildHtml.js          # Builds index.html
│   ├── distServer.js         # Starts webserver and opens final built app that's in dist in your default browser.
│   ├── srcServer.js          # Starts dev webserver with hot reloading and opens your app in your default browser.
└── webpack.config.js         # Configures webpack
```

## What are the dependencies in package.json used for?

| **Dependency** | **Use** |
|----------|-------|
|autoprefixer | Automatically adds vendor prefixes, using data from Can I Use. |
|connect-history-api-fallback  | Support reloading deep links |
|object-assign | Polyfill for Object.assign |
|react-redux|Redux library for connecting React components to Redux |
|react-router|React library for routing |
|redux|Library for unidirectional data flows |
|redux-thunk|Middleware for redux that allows actions to be declared as functions |
|babel-cli|Babel Command line interface |
|babel-core|Babel Core for transpiling the new JavaScript to old |
|babel-loader|Adds Babel support to Webpack |
|babel-plugin-react-display-name| Add displayName to React.createClass calls |
|babel-plugin-transform-react-constant-elements | Performance optimization: Hoists the creation of elements that are fully static to the top level. reduces calls to React.createElement and the resulting memory allocations. [See here](https://medium.com/doctolib-engineering/improve-react-performance-with-babel-16f1becfaa25#.2wbkg8g4d) for more info. |
|babel-preset-latest|Babel preset for ES2015, ES2016 and ES2017|
|babel-preset-react-hmre|Hot reloading preset for Babel|
|babel-preset-react| Add JSX support to Babel |
|babel-preset-stage-1| Include stage 1 feature support in Babel |
|browser-sync| Supports synchronized testing on multiple devices and serves local app on public URL |
|chai|Assertion library for use with Mocha|
|chalk|Adds color support to terminal |
|cross-env|Cross-environment friendly way to handle environment variables|
|css-loader|Add CSS support to Webpack|
|enzyme|Simplified JavaScript Testing utilities for React|
|eslint|Lints JavaScript |
|eslint-loader|Adds ESLint support to Webpack |
|eslint-plugin-react|Adds additional React-related rules to ESLint|
|eslint-watch|Wraps ESLint to provide file watch support and enhanced command line output|
|extract-text-webpack-plugin| Extracts CSS into separate file for production build |
|file-loader| Adds file loading support to Webpack |
|grommet| Grommet library utilizing React |
|html-webpack-plugin|Generates custom index.html for each environment as part of webpack build|
|mocha| JavaScript testing library |
|node-sass| Adds SASS support to Webpack |
|npm-run-all| Run multiple scripts at the same time |
|postcss-loader| Adds PostCSS support to Webpack |
|react-addons-test-utils| Adds React TestUtils |
|rimraf|Delete files |
|sass-loader| Adds Sass support to Webpack|
|sinon| Standalone test spies, stubs and mocks for JavaScript |
|sinon-chai| Extends Chai with assertions for the Sinon.JS mocking framework|
|style-loader| Add Style support to Webpack |
|webpack| Bundler with plugin system and integrated development server |
|webpack-dev-middleware| Used to integrate Webpack with Browser-sync |
|webpack-hot-middleware| Use to integrate Webpack's hot reloading support with Browser-sync |
|webpack-md5-hash| Hash bundles, and use the hash for the filename so that the filename only changes when contents change|
|yargs| Easily parse command-line arguments |

## Where are the files being served from when I run `npm start`?

Webpack serves your app in memory when you run `npm start`. No physical files are written. However, the web root is /src, so you can reference files under /src in index.html. When the app is built using `npm run build`, physical files are written to /dist and the app is served from /dist.

## Where is index.html?

It's generated by webpack using htmlWebpackPlugin. This plugin dynamically generates index.html based on the configuration in webpack.config. It also adds references to the JS and CSS bundles using hash-based filenames to bust cache. Separate bundles for vendor and application code are created and referencing within the generated index.html file so that vendor libraries and app code can be cached separately by the browser. The bundle filenames are based on the file's hash, so the filenames only change when the file contents change. For more information on this, read [Long-term caching of static assets with Webpack](https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.4aeatmtfz) and [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)

## How is Sass being converted into CSS and landing in the browser?

Magic! Okay, more specifically, it's being handled differently in dev (`npm start`) vs prod (`npm run build`).

When you run `npm start`:

 1. The sass-loader compiles Sass into CSS.
 2. Webpack bundles the compiled CSS into bundle.js. Sounds odd, but it works!
 3. bundle.js contains code that loads styles into the &lt;head&gt; of index.html via JavaScript. This is why you don't see a stylesheet reference in index.html. In fact, if you disable JavaScript in your browser, you'll see the styles don't load either.

The approach above supports hot reloading, which is great for development. However, it also creates a flash of unstyled content on load because you have to wait for the JavaScript to parse and load styles before they're applied. So for the production build, a different approach is used:

When you run `npm run build`:

 1. The sass-loader compiles Sass into CSS.
 2. The [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin) extracts the compiled Sass into styles.css.
 3. buildHtml.js adds a reference to the stylesheet to the head of index.html.

For both of the above methods, a separate sourcemap is generated for debugging Sass in [compatible browsers](http://thesassway.com/intermediate/using-source-maps-with-sass).

## I don't like the magic you just described above. How do I use a regular CSS file?

No problem. Reference your CSS file in index.html, and add a step to the build process to copy your CSS file over to the same relative location /dist as part of the build step. But be forwarned, you lose style hot reloading with this approach.

## Do I have to use Redux?

Nope. Redux is useful for applications with more complex data flows. If your app is simple, Redux is overkill. Remove Redux like this:

 1. Run `npm run remove-demo`
 2. Uninstall Redux related packages: `npm uninstall redux react-redux redux-thunk`
 3. Create a new empty component in /components.
 4. Call render on the new top level component you created in step 3 in src/index.js.

## How do I remove React Router?

 1. Uninstall React Router and routing related packages: `npm uninstall --save react-router`
 2. Delete the following files: `src/routes.js`

## How do I deploy this?

`npm run build`. This will build the project for production. It does the following:
* Minifies all JS
* Sets NODE_ENV to prod so that React is built in production mode
* Places the resulting built project files into /dist. (This is the folder you'll expose to the world).

See [this issue](https://github.com/coryhouse/react-slingshot/issues/99) for more details.

## Why are test files placed alongside the file under test (instead of centralized)?

Streamlined automated testing is a core feature of this starter kit. All tests are placed in files that end in .spec.js. Spec files are placed in the same directory as the file under test. Why?
+ The existence of tests is highly visible. If a corresponding .spec file hasn't been created, it's obvious.
+ Easy to open since they're in the same folder as the file being tested.
+ Easy to create new test files when creating new source files.
+ Short import paths are easy to type and less brittle.
+ As files are moved, it's easy to move tests alongside.

That said, you can of course place your tests under /test instead, which is the Mocha default. If you do, you can simplify the test script to no longer specify the path. Then Mocha will simply look in /test to find your spec files.

## How do I debug?

Since some browsers don't currently support ES6, we're using Babel to compile our ES6 down to ES5. This means the code that runs in the browser looks different than what we wrote. But good news, a [sourcemap](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) is generated to enable easy debugging. This means your original JS source will be displayed in your browser's dev console.
*Note:* When you run `npm start`, no JS is minified. Why? Because minifying slows the build. So JS is only minified when you run the `npm run build` script. See [more on building for production below](#how-do-i-deploy-this).

Also note that no actual physical files are written to the filesystem during the dev build. **For performance, all files exist in memory when served from the Browsersync server.**. Physical files are only written when you run `npm run build`.

**Tips for debugging via sourcemaps:**

 1. Browsers vary in the way they allow you to view the original source. Chrome automatically shows the original source if a sourcemap is available. Safari, in contrast, will display the minified source and you'll [have to cmd+click on a given line to be taken to the original source](http://stackoverflow.com/questions/19550060/how-do-i-toggle-source-mapping-in-safari-7).
 2. Do **not** enable serving files from your filesystem in Chrome dev tools. If you do, Chrome (and perhaps other browsers) may not show you the latest version of your code after you make a source code change. Instead **you must close the source view tab you were using and reopen it to see the updated source code**. It appears Chrome clings to the old sourcemap until you close and reopen the source view tab. To clarify, you don't have to close the actual tab that is displaying the app, just the tab in the console that's displaying the source file that you just changed.  
 3. If the latest source isn't displaying the console, force a refresh. Sometimes Chrome seems to hold onto a previous version of the sourcemap which will cause you to see stale code.

## Why does the build use npm scripts instead of Gulp or Grunt?

In short, Gulp is an unnecessary abstraction that creates more problems than it solves. [Here's why](https://medium.com/@housecor/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.vtaziro8n).

## Why does package.json reference the exact version?

This assures that the build won't break when some new version is released. Unfortunately, many package authors don't properly honor [Semantic Versioning](http://semver.org), so instead, as new versions are released, they will be tested and then introduced into the starter kit. But yes, this means when you do `npm update` no new dependencies will be pulled down. You'll have to update package.json with the new version manually.

## How do I handle images?

Via <a href="https://github.com/webpack/file-loader">Webpack's file loader</a>. Example: 

```
<img src={require('./src/images/myImage.jpg')} />

```

Webpack will then intelligently handle your image for you. For the production build, it will copy the physical file to /dist, give it a unique filename, and insert the appropriate path in your image tag.

## I'm getting an error when running npm install: Failed to locate "CL.exe", how do I resolve this?

On Windows, you need to install extra dependencies for browser-sync to build and install successfully. Follow the getting started steps above to assure you have the necessary dependencies on your machine.

## I can't access the external URL for Browsersync, what do I do?

To hit the external URL, all devices must be on the same LAN. So this may mean your dev machine needs to be on the same Wifi as the mobile devices you're testing.

## What about the Redux Devtools?

Install the [Redux devtools extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) in Chrome Developer Tools.

## Hot reloading isn't working! How do I fix this?

Hot reloading doesn't always play nicely with stateless functional components at this time. [This is a known limitation that is currently being worked](https://github.com/gaearon/babel-plugin-react-transform/issues/57). To avoid issues with hot reloading for now, use a traditional class-based React component at the top of your component hierarchy.

## How do I setup code coverage reporting?

Using the `npm run test:cover` command to run the tests, building a code coverage report. The report is written to `coverage/index.html`. A quick way to check coverage is:

```bash
npm run test:cover
open ./coverage/index.html
```

## What options do I have for branding?

The example application included with PageMill is already pre-branded and standardized for HPE. This means that you won't have to spend time tinkering with HTML and CSS to match PDF documentation from branding compliance anymore! However, it's important to note that only the layout options of your application can be modified, excluding application specific content that the layout encapsulates. The color scheme of your application cannot change at this time. However, if any color schemes or layouts change in the future they should be easy to incorporate into your application.

## I don't like any of the layouts. What should I consider when implementing my own?

PageMill provides an open canvas for your web content. It imposes a minimum level of consistency on your pages without getting in the way. Its presence in your application consists of a single component that 'wraps' your content.

We understand that different applications have different use cases, and require different UI presentations. PageMill can't cover every possible application need, so it won't try to. Because of this, implementing your own layout shouldn't be an issue to meet your use case.

**Note:** We encourage the use of proper UX design practices when building your application. Please see [DaVinci](https://davinci.itcs.hpe.com) for help with this.

## What happens to my application if the layouts, templates, or other included UI components change?

PageMill provides scaffolding for your project. But unlike a document template, where you have to copy and paste content from when the template changes, PageMill's wrapper components can be upgraded without touching your application code.

When changes to the header, footer or top level navigation are made, you can just run `npm install @hpe/millstone` instead of re-cloning PageMill. The ReactJS components live apart from your application code, removing the risk of an update overwriting your hard work.

## Am I able to use PageMill to write backend services?

Currently, PageMill is designed for client-side applications. Writing backend services using it would require modifying the application significantly. Please use [Addison](https://github.hpe.com/Global-IT/addison) for backend services instead.

## How do I configure the app to be isomorphic and render React components on the server instead of the client?

In order to make the application isomorphic, it'll need to be configured to work this way with the web server. Since this depends on what web server is used in production, it wasn't included with this project. In addition, since most HPE applications are [behind a login](https://github.com/coryhouse/react-slingshot/issues/18), the benefits of isomorphism (e.g. SEO since search engine bots will mostly only receive raw HTML instead of JavaScript, etc.) are reduced. Also, it's important to understand that isomorphic apps are more complex in nature.

For more information on isomorphism with React, see [this article](https://reactjsnews.com/isomorphic-react-in-real-life).

## How do I make AJAX calls?

PageMill doesn't include a library for AJAX calls. Thus, we suggest chosing a library for this that meets the needs of your project. Please [see this](https://github.com/coryhouse/react-slingshot/issues/96) for more details.

## How do I use Express or hapi.js as a production web server?

PageMill uses Browsersync for a development web server. When building for production, all files are placed into the `/dist` folder. This is static content that will need to be served by the web server of your choice. If you wish to use Express or hapi.js, your application will have to be mofied and it will need to serve the proper production ready files.

As an example to change your application to use Express, here's a [configuration file](https://github.com/coryhouse/ps-redux/blob/master/tools/distServer.js) for reference. You may need to modify other areas of your application in order for the change to work but this should get you started. [See this](https://github.com/coryhouse/react-slingshot/issues/99) for more information.

## How do I handle 404 errors?

Currently, react-router is configured to send users to a 404 page if a route cannot be resolved (on the client). However, for handling 404 errors for files and pointing to the appropriate page, it will require configuring your web server to serve up the already built 404 page (e.g. `http://localhost:3000/not-found`). This is something you'll want to think about before going to production. In the case of using [hapi.js](http://hapijs.com/) in production, [see this](http://stackoverflow.com/questions/28037025/hapi-js-custom-404-error-page) for setting up a custom 404 page.
