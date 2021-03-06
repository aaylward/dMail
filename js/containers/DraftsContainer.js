import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import MessageList from '../components/inbox/MessageList';

import { setActiveMessage } from '../actions/messagesActions';

export default connect(
  (state, props) => ({
    messages: state.messages.slice(4),
    pathname: props.location.pathname,
  }),
  {setActiveMessage},
)(MessageList);
