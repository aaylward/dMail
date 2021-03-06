import { createAction } from 'redux-actions';
import ActionTypes from './actionTypes/ipfsActionTypes';


export const changeIpAddress = createAction(
  ActionTypes.IPFS_CHANGE_IP_ADDRESS,
  ipAddress => ({ipAddress})
);

export const goOnlineStart = createAction(
  ActionTypes.IPFS_GO_ONLINE_START
);

export const goOnlineSuccess = createAction(
  ActionTypes.IPFS_GO_ONLINE_SUCCESS
);

export const goOnlineError = createAction(
  ActionTypes.IPFS_GO_ONLINE_ERROR
);

export const updateIpfsVersion = createAction(
  ActionTypes.IPFS_UPDATE_VERSION,
  ipfsVersion => ({ipfsVersion})
);
