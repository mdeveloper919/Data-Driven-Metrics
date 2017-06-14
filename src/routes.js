
// React-router handles navigation between these application 'pages'
// (each page is really just an independent React component)
import AppHome from './components/home/AppHome';

// Application Page Components
import Main from './components/home/Main';
import DailyOpsCharts from './components/home/DailyOpsCharts';

// NotFound Component (404)
import NotFound from './components/404/NotFound';

module.exports = {
  routes : [
    { path: '/',
      component: AppHome,
      indexRoute: { components: Main },
      childRoutes : [
        { path: 'Main', components: Main },
        { path: 'DailyOpsCharts', components: DailyOpsCharts },
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
