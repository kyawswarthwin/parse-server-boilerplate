'use strict';

module.exports = {
  className: 'Test',
  beforeSave: function(req, res) {
    req.object.set('name', 'Test');
    res.success();
  }
};
