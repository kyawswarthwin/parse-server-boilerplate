const Test = require('../../app/models/Test');
const aa = new Parse.Query(Test);

aa
  .get('gClqe9N3KN')
  .then(data => {
    console.log(data.name);
  })
  .catch(console.error);
