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

};

var schema = {

  "id": "number",
  "name": "string",
  "mood": "string"
};

User.find = function(query,callback) {

  //validate input
  function inputValidation(query, callback) {

    if(typeof callback !== 'function') {

      return new Error("Object.find callback must be a function.");
    }

    if(typeof query !== 'object') {

      return new TypeError("Object.find query must be an object.");
    }

    return {};
  };

  //validate vs. schema
  function schemaValidation(query) {

    var queryProperties = null;
    var validQueryProperties = null;

    for(var i = 0; i < query.length; i++) {

      queryProperties = Object.keys(query[i]);

      validQueryProperties = queryProperties.filter(function(property) {

        if(!schema[property]) {

          return new RangeError('Query did not match schema. Could not find a match for ' +
          property);
        }

        if(typeof query[i][property] !== schema[property]) {

          return new TypeError('Property value of ' + query[i][property] +
            ' in query does not match type of schema for ' + schema[property]);
        }
      });
    };

    return {};
  };

  function getMatchingUsers(query) {

    var users = data.User.filter(function(user) {

      //if all properties in a query object match properties in user
      for(var i = 0; i < query.length; i++) { //for each query

        var queryProperties = Object.keys(query[i]);

        var pass = true;

        for(var j = 0; j < queryProperties.length; j++) { //for each property in query

          if(!user.hasOwnProperty(queryProperties[j])) {

            pass = false;
            break;
          }

          if(user[queryProperties[j]] !== query[i][queryProperties[j]]) {

            pass = false;
            break;
          }
        }

        if(pass) {

          return true;

        } else {

          return false;
        }
      }
    });

    return users;
  };

  if(!query.length) {

    var temp = [];

    temp.push(query);

    query = temp;
  }

  var error = {};
  var users = null;

  error = inputValidation(query,callback);

  console.log(error);

  console.log(!(error instanceof Error));

  if(!(error instanceof Error)) {

    error = schemaValidation(query);
  }

  console.log(error);

  console.log(!(error instanceof Error));

  if(!(error instanceof Error)) {

    users = getMatchingUsers(query);
  }

  callback(error,users);
};

// function findCallback(error,users) {

//   console.log("findCallback errors: " + error);

//   if(users) {

//     for(var i = 0; i < users.length;i++) {
//       console.log("findCallback users: " + users[i].id + " , " + users[i].name + " , " + users[i].mood);
//     }

//     return users;
//   }

//   if(error) {

//     return error;
//   }

// }

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