




var pFunction = require('./js/pfunction.js');

var test = pFunction({
    name: pFunction.String('no name'),
    _: function (options) {
        return options;
    }
});


console.log(test());