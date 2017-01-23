import { routerReducer } from 'react-router-redux';

import activeMessage from './activeMessage';
import connectedToEthereum from './connectedToEthereum';
import connectedToIpfs from './connectedToIpfs';
import currentBlock from './currentBlock';
import draftBody from './draftBody';
import draftSubject from './draftSubject';
import ethereumAccounts from './ethereumAccounts';
import ipfsIpAddress from './ipfsIpAddress';
import ipfsVersion from './ipfsVersion';
import isComposing from './isComposing';
import messages from './messages';
import networkId from './networkId';
import primaryAccount from './primaryAccount';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  activeMessage,
  connectedToEthereum,
  connectedToIpfs,
  currentBlock,
  draftBody,
  draftSubject,
  ethereumAccounts,
  ipfsIpAddress,
  ipfsVersion,
  isComposing,
  messages,
  networkId,
  primaryAccount,
  routing: routerReducer,
});

export default rootReducer;
