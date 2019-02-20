'use strict';

module.exports = {
  className: '_Role',
  attributes: [
    {
      name: 'administrator',
      permissions: {
        '*': {
          read: true
        }
      }
    },
    {
      name: 'subscriber',
      permissions: {
        '*': {
          read: true
        }
      }
    }
  ]
};
