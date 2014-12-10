!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Conform=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Form, Input, Validators, _ref;

Validators = _dereq_('./validation.coffee').Validators;

_ref = _dereq_('./inputs.cjsx'), Input = _ref.Input, Form = _ref.Form;

module.exports = {
  Validators: Validators,
  Input: Input,
  Form: Form
};



},{"./inputs.cjsx":2,"./validation.coffee":3}],2:[function(_dereq_,module,exports){
var Form, Input, ReactValidation;

ReactValidation = _dereq_('./validation.coffee').ReactValidation;

Input = React.createClass({
  mixins: [ReactValidation.text()],
  onBlur: function(event, reactId) {
    this.validate(event);
    if (this.props.onBlur) {
      return this.props.onBlur(event, reactId);
    }
  },
  render: function() {
    return React.createElement("input", React.__spread({
      "ref": 'value'
    }, {
      "onBlur": this.onBlur
    }, this.props));
  }
});

Form = React.createClass({
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
    } else {
      return console.log("Firing");
    }
  },
  render: function() {
    return React.createElement("form", React.__spread({}, this.props, {
      "onSubmit": this.onSubmit
    }), this.props.children);
  }
});

module.exports = {
  Input: Input,
  Form: Form
};



},{"./validation.coffee":3}],3:[function(_dereq_,module,exports){
var ReactValidation, Validators, _lengthValidator, _regexValidator;

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
        errors.push(errorMessage);
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
        var value;
        value = x.target != null ? x.target.value : x;
        return ReactValidation._validate.bind(this, value)();
      }
    };
  };

  return ReactValidation;

})();

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

Validators = {
  None: function() {},
  Basic: {
    Regex: _regexValidator,
    Length: _lengthValidator,
    Required: function(m) {
      return _lengthValidator(1, m || "Value is required.");
    },
    Alpha: function(m) {
      return _regexValidator(/^[a-zA-Z]+$/, m);
    },
    AlphaNumeric: function(m) {
      return _regexValidator(/^[a-zA-Z0-9]+$/, m || "Can only contain alphanumeric characters.");
    }
  },
  Password: {
    Weak: function() {},
    Medium: function(m) {
      return _regexValidator(/(?=^.{7,}$)(?=.*\d).*$/, m);
    },
    Strong: function() {}
  },
  Payment: {
    Price: function(m) {
      return _regexValidator(/^[$£€]?\d+(?:\.\d\d)?$/, m || "Invalid Price");
    },
    Card: {
      All: function() {},
      Visa: function() {},
      MasterCard: function() {}
    },
    CVV: function(m) {
      return _regexValidator(/^\d{3,4}$/, m || "Invalid CVV");
    }
  },
  Web: {
    URL: function() {
      return _regexValidator(/(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/);
    },
    Domain: function() {
      return _regexValidator(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/);
    },
    IP: function() {
      return _regexValidator(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);
    }
  },
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

module.exports = {
  ReactValidation: ReactValidation,
  Validators: Validators
};



},{}]},{},[1])
(1)
});