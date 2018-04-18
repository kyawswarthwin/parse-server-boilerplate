'use strict';

const Test = require('../../app/models/Test');

const query = new Parse.Query(Test);
query
  .get('gClqe9N3KN')
  .then(data => {
    console.log(data.get('name'));
  })
  .catch(console.error);
