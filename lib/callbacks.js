//var data = require('datastore');

function wait(callback,seconds) {

  setTimeout(callback, (seconds * 1000));
}

function repeat (times, callback) {

  for(var i = 0;i<times;i++) {

    callback(i);
  }
}

function User () {

}

//wait test

console.log("wait 3 started");
wait(3, function() {

  console.log("wait 3 done");
});

//repeat test
repeat(10,function(iteration) {

  console.log(iteration + 100);
});

//repeat test 2
wait(4, function() {

  repeat(2, function(i) {

    console.log("repeating for i [" + i + "]");

    repeat(3,function(j) {

      console.log("i[" + i + "] j[" + j + "]");
    });
  });
});




module.exports = {
  wait : wait,
  repeat : repeat,
  User : User
};