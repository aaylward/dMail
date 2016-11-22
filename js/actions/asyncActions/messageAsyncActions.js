import Q from 'q';
import { fetchMail, sendMail, unlockAccount } from '../../modules/ethereumUtils';
import { addJson, getJson } from '../../modules/ipfsUtils';
import {
  fetchMessagesError,
  fetchMessagesStart,
  fetchMessagesSuccess,
  messageSendError,
  messageSendStart,
  messageSendSuccess,
} from '../messagesActions';

export const sendMessage = ({ body, from, subject, to }, password) => {
  return (dispatch) => {
    dispatch(messageSendStart());

    return unlockAccount(from, password).then(() => {
      return addJson({ body, subject }).then(messageHash => {
        console.log('Added to IPFS. Here\'s the message hash: ', messageHash);
        return sendMail({ from, messageHash, to }).then(
          transactionHash => {
            console.log('Sending mail. Here\'s the transaction hash:', transactionHash);
            dispatch(messageSendSuccess(transactionHash));
          },
          error => {
            dispatch(messageSendError(error))
          }
        );
      });
    }).done();
  }
};

export const getMessages = () => {
  return (dispatch) => {
    dispatch(fetchMessagesStart());

    return fetchMail().then(
      messages => {
        return Q.all(messages.map(message => {
          return getJson(message.messageHash).then(json => ({
            ...message,
            ...json,
          }))
        }))
        .then(decodedMessages => {
          console.log('Messages found:', decodedMessages);
          dispatch(fetchMessagesSuccess(decodedMessages));
        });
      },
      error => {
        dispatch(fetchMessagesError(error));
      }
    ).done();
  };
};
