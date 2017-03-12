import React from 'react';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, browserHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './stores';
import initialLocale from './locale';


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
initialLocale(store);

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <Route path="foo" component={App} />
          <Route path="bar" component={App} />
        </Route>
      </Router>
    </Provider>
  </AppContainer>,
  document.getElementById('app')
);