!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Conform=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Validators, form, input, _ref;

Validators = _dereq_('./validators/Validators.coffee');

_ref = _dereq_('./inputs.cjsx'), input = _ref.input, form = _ref.form;

module.exports = {
  Validators: Validators,
  input: input,
  form: form
};



},{"./inputs.cjsx":2,"./validators/Validators.coffee":4}],2:[function(_dereq_,module,exports){
var ReactValidation, form, input;

ReactValidation = _dereq_('./validation.coffee');

input = React.createClass({
  mixins: [ReactValidation.text()],
  getInitialState: function() {
    return {
      valid: true
    };
  },
  onBlur: function(event, reactId) {
    this.validate(event);
    if (this.props.onBlur) {
      return this.props.onBlur(event, reactId);
    }
  },
  render: function() {
    var c;
    c = !this.state.valid ? ' invalid' : '';
    return React.createElement("input", React.__spread({}, this.props, {
      "ref": 'value'
    }, {
      "className": this.props.className + c
    }, {
      "onBlur": this.onBlur
    }));
  }
});

form = React.createClass({
  mixins: [ReactValidation.form()],
  onSubmit: function(event, reactId) {
    var valid;
    valid = _.every(_.map(this.conformRegistered, function(node) {
      return node.validate(node.value());
    }));
    if (valid && this.props.onSubmit) {
      event.preventDefault();
      return this.props.onSubmit(event, reactId);
    } else if (!valid) {
      return event.preventDefault();
    }
  },
  render: function() {
    return React.createElement("form", React.__spread({}, this.props, {
      "onSubmit": this.onSubmit
    }), this.props.children);
  }
});

module.exports = {
  input: input,
  form: form
};



},{"./validation.coffee":3}],3:[function(_dereq_,module,exports){
var ReactValidation;

ReactValidation = (function() {
  function ReactValidation() {}

  ReactValidation._validate = function(value) {
    var errorMessage, errors, isValid, validateCb, validator, validators, _i, _len;
    errors = [];
    validators = this.props.validator instanceof Function ? [this.props.validator] : this.props.validator instanceof Array ? this.props.validator : [];
    for (_i = 0, _len = validators.length; _i < _len; _i++) {
      validator = validators[_i];
      errorMessage = validator(value);
      if (errorMessage != null) {
        errors = errors.concat(errorMessage);
      }
    }
    isValid = errors.length === 0;
    validateCb = this.props.onValidate || function(valid, errorMessage, value) {
      return console.error("onValidate is not defined.", errorMessage);
    };
    validateCb(isValid, errors, value);
    return isValid;
  };

  ReactValidation.form = function() {
    return {
      conformRegistered: [],
      componentWillMount: function() {
        var conformRegisterInput;
        conformRegisterInput = (function(_this) {
          return function(input) {
            return _this.conformRegistered.push(input);
          };
        })(this);
        return this._owner._conformRegisterInput = conformRegisterInput;
      }
    };
  };

  ReactValidation.text = function() {
    return {
      componentDidMount: function() {
        var registerWithNode;
        registerWithNode = (function(_this) {
          return function(node) {
            if (node._conformRegisterInput != null) {
              return node._conformRegisterInput(_this);
            } else if (node._owner != null) {
              return registerWithNode(node._owner);
            }
          };
        })(this);
        return registerWithNode(this);
      },
      value: function() {
        var input;
        if (this.props.value != null) {
          return this.props.value;
        }
        input = this.refs.value;
        return input.getDOMNode().value;
      },
      validate: function(x) {
        var valid, value;
        value = x.target != null ? x.target.value : x;
        valid = ReactValidation._validate.bind(this, value)();
        this.setState({
          valid: valid
        });
        return valid;
      }
    };
  };

  return ReactValidation;

})();

module.exports = ReactValidation;



},{}],4:[function(_dereq_,module,exports){
var Validators, _concat, _lengthValidator, _regexValidator;

_regexValidator = function(regex, errorMessage) {
  return (function(_this) {
    return function(value) {
      var defaultMessage;
      defaultMessage = "" + value + " did not match regex: " + regex + ".";
      if (!value.match(regex)) {
        return errorMessage || defaultMessage;
      }
    };
  })(this);
};

_lengthValidator = function(size, errorMessage) {
  return (function(_this) {
    return function(value) {
      var defaultMessage;
      defaultMessage = "Must be longer than " + size + " characters.";
      if (value.length < size) {
        return errorMessage || defaultMessage;
      }
    };
  })(this);
};

_concat = function(validators) {
  return function(value) {
    var errors, validator;
    errors = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (validator(value)) {
          _results.push(validator(value));
        }
      }
      return _results;
    })();
    if (errors.length > 0) {
      return errors;
    }
  };
};

module.exports = Validators = {
  None: function() {},
  Or: _dereq_('./or.coffee'),
  And: _dereq_('./and.coffee'),
  Regex: _dereq_('./regex.coffee'),
  Length: _dereq_('./length.coffee'),
  Required: _dereq_('./required.coffee'),
  Alpha: _dereq_('./alpha.coffee'),
  AlphaNumeric: _dereq_('./alphaNumeric.coffee'),
  Password: _dereq_('./password.coffee'),
  Price: _dereq_('./price.coffee'),
  Card: function(m) {},
  CVV: function(m) {
    return _regexValidator(/^\d{3,4}$/, m || "Invalid CVV");
  },
  Web: _dereq_('./Web.coffee'),
  Color: function() {},
  DateTime: {
    DateTime: function() {
      return _regexValidator(/([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/);
    },
    Date: function() {
      return _regexValidator(/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/);
    },
    Time: function() {
      return _regexValidator(/(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/);
    },
    DateISO: function() {
      return _regexValidator(/\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/);
    }
  },
  Contact: {
    Email: function() {
      return _regexValidator(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, "Not a valid email.");
    },
    USState: function() {},
    Zip: function(m) {
      return _regexValidator(/(^\d{5}$)|(^\d{5}-\d{4}$)/, m || "Invalid Zip Code");
    }
  },
  Number: {
    Positive: function(m) {
      return _regexValidator(/^[+]?\d+$/, m || "Must be a positive integer");
    },
    Negative: function(m) {
      return _regexValidator(/^-\d+$/, m || "Must be a negative integer");
    },
    Integer: function(m) {
      return _regexValidator(/^[+-]?\d+$/, m || "Must be an integer");
    },
    Float: function(m) {
      return _regexValidator(/^[+-]?\d+.?\d*$/, m || "Must be a float");
    },
    PositiveFloat: function(m) {
      return _regexValidator(/^[+]?\d+.?\d*$/, m || "Must be a positive float");
    },
    NegativeFloat: function(m) {
      return _regexValidator(/^-\d+.?\d*$/, m || "Must be a negative float");
    }
  }
};



},{"./Web.coffee":5,"./alpha.coffee":6,"./alphaNumeric.coffee":7,"./and.coffee":8,"./length.coffee":9,"./or.coffee":10,"./password.coffee":11,"./price.coffee":12,"./regex.coffee":13,"./required.coffee":14}],5:[function(_dereq_,module,exports){
var regexValidator;

regexValidator = _dereq_('./regex.coffee');

module.exports = {
  URL: function(m) {
    return regexValidator(/(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/, m || "Invalid URL.");
  },
  Domain: function(m) {
    return regexValidator(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/, m || "Invalid domain name.");
  },
  IP: function(m) {
    return regexValidator(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, m || "Invalid IP Address.");
  }
};



},{"./regex.coffee":13}],6:[function(_dereq_,module,exports){
var regexValidator;

regexValidator = _dereq_('./regex.coffee');

module.exports = function(m) {
  return regexValidator(/^[a-zA-Z]+$/, m || "Can only contain alphabet characters.");
};



},{"./regex.coffee":13}],7:[function(_dereq_,module,exports){
var regexValidator;

regexValidator = _dereq_('./regex.coffee');

module.exports = function(m) {
  return regexValidator(/^[a-zA-Z0-9]+$/, m || "Can only contain alphanumeric characters.");
};



},{"./regex.coffee":13}],8:[function(_dereq_,module,exports){
module.exports = function(validators) {
  return function(m) {
    var errors;
    errors = validators.map(function(validator) {
      return validator(m);
    }).filter(function(error) {
      return error;
    });
    if (errors.length !== 0) {
      return errors;
    }
  };
};



},{}],9:[function(_dereq_,module,exports){
module.exports = function(size, errorMessage) {
  return (function(_this) {
    return function(value) {
      var defaultMessage;
      defaultMessage = "Must be longer than " + size + " characters.";
      if (value.length < size) {
        return errorMessage || defaultMessage;
      }
    };
  })(this);
};



},{}],10:[function(_dereq_,module,exports){
module.exports = function(validators) {
  return function(m) {
    var errors;
    errors = validators.map(function(validator) {
      return validator(m);
    }).filter(function(error) {
      return error;
    });
    if (errors.length === validators.length) {
      return errors;
    }
  };
};



},{}],11:[function(_dereq_,module,exports){
var regexValidator;

regexValidator = _dereq_('./regex.coffee');

module.exports = function(m) {
  return regexValidator(/(?=^.{7,}$)(?=.*[^A-Za-z ]).*$/, m || "Password must be longer than 7 characters and contain at least 1 special character.");
};



},{"./regex.coffee":13}],12:[function(_dereq_,module,exports){
module.exports = function(m) {
  return regexValidator(/^[$£€]?\d+(?:\.\d\d)?$/, m || "Invalid Price");
};



},{}],13:[function(_dereq_,module,exports){
module.exports = function(regex, errorMessage) {
  return (function(_this) {
    return function(value) {
      var defaultMessage;
      defaultMessage = "" + value + " did not match regex: " + regex + ".";
      if (!value.match(regex)) {
        return errorMessage || defaultMessage;
      }
    };
  })(this);
};



},{}],14:[function(_dereq_,module,exports){
var lengthValidator;

lengthValidator = _dereq_('./length.coffee');

module.exports = function(m) {
  return lengthValidator(1, m || "Value is required.");
};



},{"./length.coffee":9}]},{},[1])
(1)
});