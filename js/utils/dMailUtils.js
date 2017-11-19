import Q from 'q';
import { createContractInterface } from './ethereumUtils';

import {
  DMAIL_ABI,
  DMAIL_ADDRESS_ROPSTEN,
  DMAIL_ADDRESS_PRIVATENET,
  NETWORK_ID_PRIVATENET,
  NETWORK_ID_TESTNET,
} from './constants';

let DMailInterface;

export const getUnreadCount = account => {
  const deferred = Q.defer();

  DMailInterface.getUnreadCount({
    from: account,
  }, (error, result) => {
    if (error) {
      deferred.reject(error);
    }

    deferred.resolve(result);
  });

  return deferred.promise;
};

const getDMailAddress = (networkId) => {
  if (networkId === NETWORK_ID_PRIVATENET) {
    return DMAIL_ADDRESS_PRIVATENET;
  } else if (networkId === NETWORK_ID_TESTNET) {
    return DMAIL_ADDRESS_ROPSTEN;
  }
  throw new Error(`No address found for network ID: ${networkId}. Are you sure there's a dMail contract deployed on this network?`);
};

export const createDMailInterface = networkId => {
  const dMailContractAddress = getDMailAddress(networkId);
  return DMailInterface = createContractInterface(dMailContractAddress, DMAIL_ABI);
};

export const clearInbox = (from) => {
  DMailInterface.clearInbox({
    from,
    gas: 1000000
  });
};

export const fetchArchiveAddress = (owner) => {
  return Q(DMailInterface.getArchiveAddress({
    from: owner,
  }));
};

export const fetchMessages = (account) => {
  return getUnreadCount(account).then(unreadCount => {
    const messages = [];

    for (let i = 0; i < unreadCount; i++) {
      const [ sender, messageHash, sentDate ] = DMailInterface.getMail(i, {
        from: account,
      });

      messages.push({
        messageHash,
        sender,
        sentDate: sentDate.toString(),
      });
    }

    return messages;
  }, error => {
    console.error('Failed to getUnreadCount', error);
    throw error;
  });
};

export const sendMail = ({ from, messageHash, to }) => {
  const deferred = Q.defer();
  let transactionHash;

  try {
    transactionHash = DMailInterface.sendMessage(to, messageHash, {
      from,
      gas: 1000000,
    });
  } catch (error) {
    deferred.reject(error);
  }

  deferred.resolve(transactionHash);
  return deferred.promise;
};

export const updateArchiveAddress = ({ from, newArchiveAddress }) => {
  DMailInterface.updateArchiveAddress(newArchiveAddress, {
    from,
    gas: 1000000
  });
};

export const watchForArchiveAddressUpdated = () => {
  const archiveAddressUpdatedEvent = DMailInterface.ArchiveAddressUpdated();
  archiveAddressUpdatedEvent.watch(function(error, result) {
    if (error) console.error(error);
  })
};

export const watchForMail = () => {
  const receivedMailEvent = DMailInterface.ReceivedMail();
  receivedMailEvent.watch(function(error, result) {
    if (error) console.error(error);
  })
};

export const watchForNewMailArchived = () => {
  const newMailArchivedEvent = DMailInterface.NewMailArchived();
  newMailArchivedEvent.watch(function(error, result) {
    if (error) console.error(error);
  })
};
