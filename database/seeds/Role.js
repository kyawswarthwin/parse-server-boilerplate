'use strict';

module.exports = {
  className: '_Role',
  properties: [
    {
      name: 'administrator',
      permissions: {
        '*': {
          read: true
        },
        'role:administrator': {
          read: true,
          write: true
        }
      }
    },
    {
      name: 'subscriber',
      permissions: {
        '*': {
          read: true
        },
        'role:administrator': {
          read: true,
          write: true
        }
      }
    }
  ]
};
