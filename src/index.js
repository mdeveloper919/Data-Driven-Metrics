/* eslint-disable import/default */

import React from 'react';
import ReactDom from 'react-dom';
import Routes from './routes';
import {Router, hashHistory} from 'react-router';
import './styles/styles.scss';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-98124038-1');


import appStore from './reducers';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

let store = createStore(appStore);

require('./images/favicon.ico');
let element = document.getElementById('app');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

ReactDom.render(
  <Provider store={store}>
		<Router history={hashHistory} onUpdate={logPageView} routes={Routes.routes} />
	</Provider>, element);

document.body.classList.remove('loading');
