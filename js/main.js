import React from 'react';
import { render } from 'react-dom';
import Q from 'q';

// Styles
require("font-awesome-webpack");
import '../sass/style.sass';

// Redux/Router
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRedirect, IndexRoute, browserHistory } from 'react-router';
import configureStore from './modules/reduxUtils';

import {
  init as ethereumInit,
  getAccounts as ethereumGetAccounts,
  getCoinbase as ethereumGetCoinbase
} from './modules/ethereumUtils';

import { init as ipfsInit } from './modules/ipfsUtils';

import { getMessages } from './actions/asyncActions/messageAsyncActions';

// Components
import App from './components/App';
import MailboxContainer from './containers/MailboxContainer';
import MessageFullContainer from './containers/MessageFullContainer';
import DraftsContainer from './containers/DraftsContainer';
import InboxContainer from './containers/InboxContainer';
import SettingsContainer from './containers/SettingsContainer';

class Application {
  fetchData() {
    const { dispatch, getState } = this.store;
    const { primaryAccount } = getState();
    dispatch(getMessages(primaryAccount));
    // dispatch();
    // dispatch();
  }

  getPrimaryAccount() {
    const storedPrimaryAccount = localStorage.getItem('primaryAccount');
    if (!storedPrimaryAccount) {
      return Q(storedPrimaryAccount);
    }

    return ethereumGetCoinbase().then((coinbase) => {
      localStorage.setItem('primaryAccount', coinbase);
      return coinbase;
    });
  }

  goOnline() {
    return Q.all([
      ethereumInit(),
      ipfsInit()
    ]).spread((networkId, { version: ipfsVersion }) => {
      return {
        connectedToEthereum: true,
        connectedToIpfs: true,
        ipfsVersion,
        networkId,
      };
    });
  }

  setupRedux(initialState) {
    this.store = configureStore(initialState, browserHistory);
  }

  start() {
    window.dMail = this;

    this.goOnline().then((initialData) => {
      ethereumGetAccounts().then((ethereumAccounts) => {
        this.getPrimaryAccount().then((primaryAccount) => {
          this.setupRedux({...initialData, ethereumAccounts, primaryAccount});
          this.fetchData();
          this.startRouter();
        }).catch(error => {throw error}).done()
      }).catch(error => {throw error}).done();
    }).catch(error => {throw error}).done();
  }

  startRouter() {
    const syncedHistory = syncHistoryWithStore(browserHistory, this.store, {
      selectLocationState: state => state.routing
    });
    render(
      <Provider store={this.store}>
        <Router history={syncedHistory}>
          <Route path="/" component={App}>
            <IndexRedirect to="/inbox" />
            <Route path="/inbox" component={MailboxContainer}>
              <IndexRoute component={InboxContainer} />
              <Route path="/drafts" component={DraftsContainer} />
              <Route path="/drafts/:messageId" component={MessageFullContainer} />
              <Route path="/inbox/:messageId" component={MessageFullContainer} />
            </Route>
            <Route path="/settings" component={SettingsContainer} />
          </Route>
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  }
}

new Application().start();
