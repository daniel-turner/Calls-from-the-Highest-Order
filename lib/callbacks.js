'use strict';

var data = require('./datastore.js');

function wait(seconds,callback) {

  setTimeout(function(){
    callback();
  }, (seconds * 1000));
}

function repeat (times, callback) {

  for(var i = 0;i<times;i++) {

    callback(i);
  }
}

function User () {

}

var schema = {

  "id": "number",
  "name": "string",
  "mood": "string"
};

User.find = function(query,callback) {

  var error = null;

  //validate input

  if(typeof callback !== 'function') {

    findCallback("Object.find callback must be a function.", null);
  }

  if(typeof query !== 'object') {

    callback(new TypeError("Object.find query must be an object."), null);
  }

  //does query match schema

  var queryProperties = null;
  var validQueryProperties = null;

  if(!query.length) {//HACK

    var temp = [];

    temp.push(query);

    query = temp;
  }

  for(var i = 0;i < query.length;i++) {

    queryProperties = Object.getOwnPropertyNames(query[i]);

    validQueryProperties = queryProperties.filter(function(property) {

      if(!schema.hasOwnProperty(property)) {

        callback(new RangeError('Query did not match schema. Could not find a match for ' +
        property), []);

        return false;
      }

      if(typeof query[i][property] !== schema[property]) {

        callback(new TypeError('Property value of ' + query[i][property] +
          ' in query does not match type of schema for ' + schema[property]), []);

        return false;
      }
    });

    // if(queryProperties.length !== validQueryProperties.length) {

    //     return false;

    //   } else {

    //     return true;
    //   }
  };



  //filter
  var users = data.User.filter(function(user) {

    //if all properties in a query object match properties in user
    for(var i = 0;i < query.length;i++) { //for each query

      queryProperties = Object.getOwnPropertyNames(query[i]);

      var pass = true;

      for(var j = 0;j < queryProperties.length;j++) { //for each property in query

        // console.log(user.hasOwnProperty(queryProperties[j]));
        // console.log(user[queryProperties[j]]);
        // console.log(query[i][queryProperties[j]]);

        if(!user.hasOwnProperty(queryProperties[j])) {

          pass = false;
          break;
        }

        // if(typeof user[queryProperties[j]] !== typeof query[i][queryProperties[j]]) {

        //   callback(new TypeError('Property value of ' + query[i] + ' in query does not match schema.'), null);
        // }

        if(user[queryProperties[j]] !== query[i][queryProperties[j]]) {

          pass = false;
          break;
        }
      }

      //console.log(pass);

      if(pass) {

        return true;
      }
    }

    return false;
  });

  callback(error,users);
};

function findCallback(error,users) {

  console.log("findCallback errors: " + error);

  if(users !== null) {

    for(var i = 0; i < users.length;i++) {
      console.log("findCallback users: " + users[i].id + " , " + users[i].name + " , " + users[i].mood);
    }
  }

}

// //wait test

// console.log("wait 3 started");
// wait(3, function() {

//   console.log("wait 3 done");
// });

// //repeat test
// repeat(10,function(iteration) {

//   console.log(iteration + 100);
// });

// //repeat test 2
// wait(4, function() {

//   repeat(2, function(i) {

//     console.log("repeating for i [" + i + "]");

//     repeat(3,function(j) {

//       console.log("i[" + i + "] j[" + j + "]");
//     });
//   });
// });

//User test 1
// User.find([
//   {"id": '3'}
//   ], findCallback);

// User.find([
//   {"name": "turner"},
//   {"name": "swartz"},
//   {"id" : 8,"name" : "engelbart","mood" : "serene"},
//   {"mood": "romantic"}
// ], findCallback);

// User.find([
//   {"jint": "core"}
// ], findCallback);

module.exports = {
  wait : wait,
  repeat : repeat,
  User : User
};