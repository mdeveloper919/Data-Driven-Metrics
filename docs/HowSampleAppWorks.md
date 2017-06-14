# How Sample App Works

This document refers to the included sample application. The purpose of which is to modify to suit your needs, jump starting your development.

## Main Components Overview

A single component, **AppWrap**, serves as a wrapper for your page. It is a React component, but you can treat it like an enhanced HTML **&lt;body&gt;** tag.

**AppHome.js**, found in `/src/components/home/`, is the entry point and core of your application. It serves as the spot where your application view (as in MVC and MVVM) is generated. Please [see this](http://stackoverflow.com/questions/667781/what-is-the-difference-between-mvc-and-mvvm) if you are unfamiliar with MVC and MVVM patterns.

The following shows how it would look to set up your application view with internal HPE branding and a left hand slide-out navigation menu:

```
import AppWrap from '@hpe/millstone/components/internal/sidebar/AppWrap';
...
<AppWrap appTitle="My App" ...>

    {this.props.children}

</AppWrap>
```

PageMill installs a library called **react-router** when you set it up. This library allows you to set up your application page routes in a separate file, and then have them automatically pushed into the view provided by **AppHome**.

## AppHome.js

**AppHome.js** is the entry point for your application. This file is where the Appwrap comoponent lives, and where you will configure the header and pass in your top-level navigation links.

* You may choose which styling to use through the "isExternal" property on the AppWrap component.
* Primary Navigation are passed in an array of links to AppWrap.

See the **AppHome.js** file for examples.

## AppWrap Properties

The AppWrap component accepts attributes. You can either pass them independently, or as properties on an **options** object.

### Accepted Properties

* appTitle = (String) Insert the Application Title to display in Header.
* appIcon = (String) URL to an Application Icon. If not provided, HPE logo appears.
* menuIcon = (String) URL to an Menu Icon. If not provided, HPE logo appears.
* menuItems = (Array) Array of components/links to be rendered in the Primary Navigation.
* headerItems = (Array) Array of components to render on in the header (e.g. search box, user menu).
* navActive = (bool) When the page comes up, show the left hand nav pane as open (only applies to sidebar layouts).

e.g.:
```
<AppWrap  
  appTitle="My Application"  
  appIcon="img/cube_wt.svg"
  menuIcon="img/cube_bk.svg"
  menuItems={menuItems}
  headerItems={headerItems}
>
  {this.props.children}
</AppWrap>
```
Or...
```
var layoutOptions = {
  appTitle: "My Application",
  appIcon: "img/cube_wt.svg",
  menuIcon:"img/cube_bk.svg",
  menuItems: menuItems,
  headerItems: headerItems,
  navActive: true
};
...
<AppWrap options={layoutOptions}>
  {this.props.children}
</AppWrap>
```

## React-Router and Application Routes

[React-Router](https://github.com/reactjs/react-router) is a very popular package for React. It is extensively documented, and there are an enormous number of examples using it on the Internet.

PageMill provides a starter routes file:
[/src/routes.js](/src/routes.js)

This sample route object loads three different components into the AppHome view:

```
// Application Page Components
import Page1 from './components/home/Page1';
import Page2 from './components/home/Page2';
import Page3 from './components/home/Page3';

// NotFound Component (404)
import NotFound from './components/404/NotFound';

module.exports = {
  routes : [
    { path: '/',
      component: AppHome,
      indexRoute: { components: Page1 },
      childRoutes : [
        { path: 'page1', components: Page1 },
        { path: 'page2', components: Page2 },
        { path: 'page3', components: Page3 },
        { path: 'not-found', components: NotFound } // keep this line for explicitly redirecting to a 404 page from web server (e.g. hapi.js)
      ]
    },
    {
      path: '*', // for all other routes not defined above, redirect to 404 page
      component: AppHome,
      indexRoute: { components: NotFound }
    }
  ]
};
```

Since React is a JavaScript, client-side framework, the router takes the place of loading new complete pages from a server. The react-router responds to user clicks in **&lt;Link&gt;** components to dynamically change what is rendered in the page.

### Example

1. User clicks on a **&lt;Link&gt;** object.

  ```
  <Link to="page2" activeClassName="active">Page 2</Link>
  ```

2. This triggers react-router to look for the path **page2** in the routes object.

  ```
  { **path: 'page2'**, components: Page2 },
  ```

3. This path resolves to the **Page2** component.

  ```
  { path: 'page2', **components: Page2** },
  ```

4. The contents of the **Page2** component, which live in the `./components/Page2` file as shown in the import directives, are pushed into the ```{this.props.children}``` placeholder in AppHome.

For more information on react-router, see [DaVinci](https://davinci.itcs.hpe.com) or the [react-router](https://github.com/reactjs/react-router) project.

## Adding Pages to Your Application

New pages are added to your application by creating components in the `/src/components` directory, and then adding those components to the route object in `/src/routes.js`. We recommend organization your components in separate folders by their feature/domain (e.g. reports, scheduler, etc.).

### Example

1. Copy the file `/src/components/home/Page1.js` to a new file name of `/src/components/MyNewFeatureOrDomain/MyNewPage.js`.

2. Open **MyNewPage.js** and change the name of the component from **Page1** to **MyNewPage**.

  ```
  Old: class Page1 extends React.Component {
  New: class MyNewPage extends React.Component {
  ```

3. Build your React component using HTML, React, and Grommet objects.

4. Add your new page component to the **routes.js** file.

  ```
  import AppHome from './components/home/AppHome';
  import Page1 from './components/home/Page1';
  import Page2 from './components/home/Page2';
  import Page3 from './components/home/Page3';
  >> import MyNewPage from './components/MyNewFeatureOrDomain/MyNewPage'; <<
  ```

5. In **routes.js**, update the routes object. Choose whatever route path that you want to use for referencing the new component/page.

  ```
  module.exports = {
    routes : [
      { path: '/',
        component: AppHome,
        indexRoute: { components: Page1 },
        childRoutes : [
          { path: 'page1', components: Page1 },
          { path: 'page2', components: Page2 },
          { path: 'page3', components: Page3 },
          >> { path: 'mynewpage', components: MyNewPage }, <<
          { path: 'not-found', components: NotFound } // keep this line for explicitly redirecting to a 404 page from web server (e.g. hapi.js)
        ]
      },
      {
        path: '*', // for all other routes not defined above, redirect to 404 page
        component: AppHome,
        indexRoute: { components: NotFound }
      }
    ]
  };
  ```

Now that you have built your own application components and integrated them with the application core, you can make them available using react-router components.

## Adding Pages to Top Level Navigation

The **AppHome** component provides an example of how you can expose your new page components:

```
//------------------------------------------------------------------------------------------------------------------------------------
// Function to populate array of Navigation links to pass to AppWrap
setMenuItems() {
  var menuItems = [];

  menuItems.push(<Link to="page1" activeClassName="active">Page 1</Link>); // example react-router link (app navigation)
  menuItems.push(<Link to="page2" activeClassName="active">Page 2</Link>);

  menuItems.push(<Anchor href="http://www.hpe.com/" target="blank">Hewlett Packard Enterprise</Anchor>); // example Grommet anchor

  return(menuItems);
}
```

**menuItems** is an array that we populate with our navigation links. The **&lt;Link&gt;** component is provided by the react-router library as a substitute for regular HTML anchors.

Remember, React applications live in the browser without needing to round trip to a web server in order to change what's rendered. The **&lt;Link&gt;** components intercept the user's click and trigger the page to re-render via JavaScript as if a new page had been pulled down from the server.

Once you have defined you menuItems array, you pass it to AppWrap as a property:

```
<AppWrap  
  appTitle="My Application"  
  appIcon="img/cube_wt.svg"
  menuIcon="img/cube_bk.svg"
  >> menuItems={menuItems} <<
  headerItems={headerItems}
>
  {this.props.children}
</AppWrap>
```

AppWrap then takes care of rendering the navigation for you, based on the layout you have chosen.

## Giving your Application a Name

You can rename the **UxUi-PageMill** directory to whatever you want. All components are loaded using relative paths.

You can rename or move the application directory as many time as you want.

To change the application name that appears in the browser tab when the application loads, go to `/src/index.ejs` and
change the HTML title to the name of your choosing.

```
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta charset="UTF-8">
  <title> -> PageMill Example Application <- </title>
  ...
```

## Giving Your Application a Logo

The current logo included with the sample app is only a placeholder. You should change it to something that identifies your application, because that is a visual cue for your users to tell them `you are here`.

**Note:** It's suggested not to use the HPE logo. Instead, use a logo specific to your application.

Before changing your logo, observe the following **AppHome** component.

```
  let appIcon = require('../../images/cube_wt.svg');
  let menuIcon = require('../../images/cube_bk.svg');

  return (

    <AppWrap
      appTitle="My Application"
      appIcon={appIcon}
      menuIcon={menuIcon}
      menuItems={menuItems}
      headerItems={headerItems}
    >

      {this.props.children}

    </AppWrap>

  );
```

To change your logo, do the following steps:

1. In the **AppHome** component, you will see that there are a few parameters sent to **AppWrap**. These are the parameters that should be modified to include your logo. Depending on which layout you use for application (i.e. which version of **AppWrap**), you may want a different logo for the sidebar navigation and the header, because of the background colors applied. Put your new logo(s) in the `\src\images` directory.

2. Update the **appIcon** and **menuIcon** values to point to your new application logo(s).
