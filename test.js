




var pFunction = require('./js/pfunction.js');



var makeFancyStuff = pFunction ({
    lastname: pFunction.String().min(3).max(100),
    firstname: pFunction.String('').min(0).max(100),
    age: pFunction.Number().min(1).max(120),
    gender: pFunction.Enum(['male','female','none']).optional('none'),
    _: function (options) {
        console.log('This is a real Person',options);
    }
});

makeFancyStuff({lastname: 'Haeferer',age : 20, gender: 'male'});