# pfunction
Library to manage parameters on functions (including options, typecheck, enumerations)

# Motivation

If you build a library so others can use it to access your data or use your algorithms (remotely or locally) you need to provide respective access during function calls (and parameters)

Traditionally this will look like
```javascript
doIt ("an url","a method", "an authentication")
```
Since names are not managed or typed, this will result in problems. It's just the first, second .. parameter.

Most interfaces therefore will follow a pattern where all parameters are named elements of an object.

```javascript
doit({
    url: "...",
    method: "...",
    authentication: "..."
})
```
Much better, because the parameters now have names. But there are still a lot of problems:
* which options can be used
* which values are allowed
* is the value needed

Some libraries use special functions like `assign` or `extend` to manage the parameter preparation. But if it comes to type or required parameters...

__pfunction is a more complete idea__

__Note:__ You will not use pfunction for all your functions, but if these functions are called by external libarys / systems this will build a complete new layer of security to your interfaces

# Usage

You create a function by executing the main pFunction with a parameter describing the parameters for this function and the function itself `(named '_')`

```javascript
var pFunction = require('pfunction');

var makeFancyStuff = pFunction ({
    lastname: pFunction.String().min(3).max(100),
    firstname: pFunction.String('').min(0).max(100),
    age: pFunction.Number().min(1).max(120),
    gender: pFunction.Enum(['male','female','none']).optional('none'),
    _: function (options) {
        console.log('This is a real Person',options);
    }
});
```



# pFunction functions

The pFunction object also contains constructors to describe the parameters.

## `pFunction.p()`

Creates a Parameter. Start here to define a Parameter

## `pFunction.String(<default>)`

Shortcut for `pFunction.p().isString()`, set optional value is provided.

## `pFunction.Number(<default>)`

Shortcut for `pFunction.p().isNumber()`, set optional value is provided.

## `pFunction.Enum([<value>,<value>,...])`

Shortcut for `pFunction.p().enumeration(<default>)`

# parameter functions (can be piped)


## `parameter.min(min)`
If parameter is number:
* parameter must be greater or equal to <min>
If parameter is string:
* parameterstring must be at least <min> characters long

## `parameter.max(max)`
If parameter is number:
* parameter must be less or equal to <max>
If parameter is string:
* parameterstring must be shorter than <max> characters

## `parameter.isString()`
Parameter needs to be a string

## `parameter.isNumber()`
Parameter needs to be a number

## `parameter.enumeration(<array>)`
Parameter needs to be ONE from the collection of values provided

## `parameter.optional(<value>)`
Set parameter to optional, set default value to `<value>` if parameter is not provided.

