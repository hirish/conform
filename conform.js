!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Conform=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ValidatedForm, ValidatedInput, Validators, _ref;

Validators = _dereq_('./validation.coffee').Validators;

_ref = _dereq_('./inputs.coffee'), ValidatedInput = _ref.ValidatedInput, ValidatedForm = _ref.ValidatedForm;

module.exports = {
  Validators: Validators,
  ValidatedInput: ValidatedInput,
  ValidatedForm: ValidatedForm
};


},{"./inputs.coffee":2,"./validation.coffee":3}],2:[function(_dereq_,module,exports){
/** @jsx React.DOM */;
var ReactValidation, ValidatedForm, ValidatedInput;

ReactValidation = _dereq_('./validation.coffee').ReactValidation;

ValidatedInput = React.createClass({displayName: 'ValidatedInput',
  mixins: [ReactValidation.text()],
  onBlur: function(event, reactId) {
    this.validate(event);
    if (this.props.onBlur) {
      return this.props.onBlur(event, reactId);
    }
  },
  render: function() {
    return this.transferPropsTo(React.DOM.input( {onBlur:this.onBlur} ));
  }
});

ValidatedForm = React.createClass({displayName: 'ValidatedForm',
  mixins: [ReactValidation.form()],
  onSubmit: function(event, reactId) {
    var valid;
    valid = _.every(_.map(this.conformRegistered, function(node) {
      return node.validate(node.value());
    }));
    if (valid && this.props.onSubmit) {
      return this.props.onSubmit(event, reactId);
    } else {
      return valid;
    }
  },
  render: function() {
    return this.transferPropsTo(React.DOM.form( {onSubmit:this.onSubmit}, this.props.children));
  }
});

module.exports = {
  ValidatedInput: ValidatedInput,
  ValidatedForm: ValidatedForm
};


},{"./validation.coffee":3}],3:[function(_dereq_,module,exports){
/** @jsx React.DOM */;
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
      return console.error("Undefined error function.", errorMessage);
    };
    validateCb(isValid, errors, value);
    return isValid;
  };

  ReactValidation.form = function() {
    return {
      conformRegistered: [],
      componentWillMount: function() {
        var addRegisterToNode, conformRegisterInput;
        conformRegisterInput = (function(_this) {
          return function(input) {
            return _this.conformRegistered.push(input);
          };
        })(this);
        addRegisterToNode = function(node) {
          node.conformRegisterInput = conformRegisterInput;
          if (node.props.children) {
            return React.Children.forEach(node.props.children, addRegisterToNode);
          }
        };
        return addRegisterToNode(this);
      }
    };
  };

  ReactValidation.text = function() {
    return {
      componentDidMount: function() {
        var registerWithNode;
        registerWithNode = (function(_this) {
          return function(node) {
            if (node.conformRegisterInput != null) {
              return node.conformRegisterInput(_this);
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
        input = React.Children.only(this.props.children);
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
      defaultMessage = "" + value + " was not >= " + size + ".";
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
      return _regexValidator(/^[a-zA-Z0-9]+$/, m);
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
    URL: function() {},
    Domain: function() {},
    IP: function() {}
  },
  Color: function() {},
  DateTime: {
    DateTime: function() {},
    Date: function() {},
    Time: function() {}
  },
  Contact: {
    Email: function() {},
    USState: function() {},
    Zip: function(m) {
      return _regexValidator(/(^\d{5}$)|(^\d{5}-\d{4}$)/, m || "Invalid Zip Code");
    },
    Phone: {
      UK: function() {},
      USA: function() {},
      France: function() {}
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
    },
    Range: function(m) {}
  }
};

module.exports = {
  ReactValidation: ReactValidation,
  Validators: Validators
};


},{}]},{},[1])
(1)
});