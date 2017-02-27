/*


MIT License

Copyright (c) 2017 KEAtec GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


*/


(function () {
    var Value = function () {
        this._needed = true;
    };

    var ValueClass = {
        regEx: function (def, ext) {
            var test = new RegExp(def, ext === undefined ? 'gi' : ext);
            this._regEx = { exp: def, def: ext === undefined ? 'gi' : ext };
            return this;
        },
        optional: function (def) {
            this._needed = false;
            this._defaults = def;
            return this;
        },
        isString: function () {
            this._isString = true;
            return this;
        },
        isNumber: function () {
            this._isNumber = true;
            return this;
        },
        matches: function (def) {
            this._regEx = def;
            return this;
        },
        min: function (def) {
            this._min = def;
            return this;
        },
        max: function (def) {
            this._max = def;
            return this;
        },
        between: function (min, max) {
            this._min = min;
            this._max = max;
            return this;
        },
        defaults: function (def) {
            this._defaults = def;
            return this;
        },
        enumeration: function (def) {
            this._matches = def;
            return this;
        }
    };

    Value.prototype = ValueClass;

    var build = function (def, name) {
        var back = ['true'];
        if (def._needed) {
            back.push('(' + name + ' !== undefined)');
        }
        if (def._isString === true) {
            back.push('(' + name + ' === undefined || typeof(' + name + ') == \'string\')');
            if (def._max !== undefined) back.push('(' + name + ' === undefined || (\'\'+' + name + ').length <= ' + def._max + ')');
            if (def._min !== undefined) back.push('(' + name + ' === undefined || (\'\'+' + name + ').length >= ' + def._min + ')');
        }
        if (def._isNumber === true) {
            back.push('(' + name + ' === undefined || typeof(' + name + ') == \'number\')');
            if (def._max !== undefined) back.push('(' + name + ' === undefined || ' + name + ' <= ' + def._max + ')');
            if (def._min !== undefined) back.push('(' + name + ' === undefined || ' + name + ' >= ' + def._min + ')');
        }
        if (def._matches !== undefined) {
            back.push('(' + name + ' === undefined || (' + JSON.stringify(def._matches) + ').indexOf(' + name + ') >= 0)');
        }
        if (def._regEx !== undefined) {
            back.push('(' + name + ' === undefined || ((\'\'+' + name + ').match(/' + def._regEx.exp + '/' + def._regEx.def + ') == ' + name + '))');
        }
        back = back.join(' && ');
        return back;
    };


    var buildCheck = function (def) {
        var back = [];
        for (var i in def) {
            if (i == '_') continue;
            back.push('if (!(' + build(def[i], 'params.' + i) + ')) throw new Error(\'Error at ParameterCheck: [' + i + ' = \'+JSON.stringify(params.' + i + ')+\'] failed\') ;');
            if (!def[i]._needed) {
                back.push('back[\'' + i + '\'] = (params.' + i + ' === undefined ? ' + JSON.stringify(def[i]._defaults) + ' : params.' + i + ');');
            } else {
                back.push('back[\'' + i + '\'] = params.' + i + ';');
            }
        }
        var code = 'function check(aparams) {var params = (aparams === undefined ? {} : aparams);var back = {}; ' + back.join('\n') + '; return back}';
        var exec;
        eval('exec = ' + code);
        return exec;
    };


    var main = function (parameters) {
        var check = buildCheck(parameters);
        if (parameters._ === undefined) throw new Error('a Parameters definition need a function _');
        return function (options) {
            opts = check(options);
            return parameters._(opts);
        };

    };

    main.p = function (def) {
        return new Value(def);
    };

    main.String = function (def) {
        if (def === undefined) return main.p().isString();
        return main.p().isString().optional().defaults(def);
    };
    main.Number = function (def) {
        if (def === undefined) return main.p().isNumber();
        return main.p().isNumber().optional().defaults(def);
    };

    if (typeof window == 'undefined' || typeof window === undefined) {
        module.exports = main;
    } else {
        window['pFunction'] = main;
    }
})();