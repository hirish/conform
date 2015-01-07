!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Demo=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var $container, Demo, Icon, submit;

Icon = _dereq_('../../oneshop/coffee/utils/Icon.cjsx');

submit = {
  WAITING: 1,
  SUCCESS: 2
};

module.exports = Demo = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      submitState: submit.WAITING,
      errors: {}
    };
  },
  onValidate: function(name) {
    return (function(_this) {
      return function(valid, errorMessage, value) {
        _this.state.errors[name] = valid ? null : errorMessage;
        return _this.setState({
          errors: _this.state.errors
        });
      };
    })(this);
  },
  onSubmit: function() {
    this.setState({
      submitState: submit.SUCCESS
    });
    return setTimeout(((function(_this) {
      return function() {
        return _this.setState({
          submitState: submit.WAITING,
          username: '',
          email: '',
          password: '',
          confirm: ''
        });
      };
    })(this)), 1000);
  },
  render: function() {
    var confirmValidator, errorIcon, submitButton;
    errorIcon = (function(_this) {
      return function(name) {
        var error;
        if (_this.state.errors[name] != null) {
          error = React.createElement("span", null, _this.state.errors[name].map(function(error) {
            return React.createElement("div", {
              "key": error
            }, error);
          }));
          return React.createElement(Icon, {
            "icon": "exclamation-circle",
            "classes": "input",
            "tooltip": error
          });
        }
      };
    })(this);
    confirmValidator = (function(_this) {
      return function(value) {
        if (value !== (_this.state.password || '')) {
          return "Does not match password.";
        }
      };
    })(this);
    submitButton = this.state.submitState === submit.WAITING ? React.createElement("input", {
      "type": "submit",
      "value": "Submit",
      "className": "button-primary"
    }) : this.state.submitState === submit.SUCCESS ? React.createElement("input", {
      "type": "submit",
      "value": "Success!",
      "className": "button-primary success"
    }) : void 0;
    return React.createElement(Conform.form, {
      "onSubmit": this.onSubmit
    }, React.createElement("label", null, "Username"), React.createElement(Conform.input, {
      "type": "text",
      "validator": [Conform.Validators.Required(), Conform.Validators.Length(4), Conform.Validators.AlphaNumeric()],
      "onValidate": this.onValidate('username'),
      "valueLink": this.linkState('username'),
      "placeholder": "Desired Username",
      "className": "u-full-width"
    }), errorIcon('username'), React.createElement("label", null, "Email"), React.createElement(Conform.input, {
      "placeholder": "username@domain.com",
      "type": "text",
      "validator": Conform.Validators.Contact.Email(),
      "onValidate": this.onValidate('email'),
      "valueLink": this.linkState('email'),
      "className": "u-full-width"
    }), errorIcon('email'), React.createElement("label", null, "Password"), React.createElement(Conform.input, {
      "type": "password",
      "validator": Conform.Validators.Password(),
      "onValidate": this.onValidate('password'),
      "valueLink": this.linkState('password'),
      "className": "u-full-width"
    }), errorIcon('password'), React.createElement("label", null, "Confirm Your Password"), React.createElement(Conform.input, {
      "type": "password",
      "validator": confirmValidator,
      "onValidate": this.onValidate('confirm'),
      "valueLink": this.linkState('confirm'),
      "className": "u-full-width"
    }), errorIcon('confirm'), React.createElement("label", null), submitButton);
  }
});

$container = document.getElementById('react-base');

React.render(React.createElement(Demo, null), $container);



},{"../../oneshop/coffee/utils/Icon.cjsx":2}],2:[function(_dereq_,module,exports){
var TooltipMixin;

TooltipMixin = _dereq_('./TooltipMixin.coffee');

module.exports = React.createClass({
  mixins: [TooltipMixin],
  getInitialState: function() {
    return {
      node: null
    };
  },
  componentDidMount: function() {
    return this.setState({
      node: this.getDOMNode()
    });
  },
  render: function() {
    var classObj, classes, clickFunction;
    classObj = {};
    if (this.props.classes != null) {
      classObj[this.props.classes] = true;
    }
    classObj["fa fa-" + this.props.icon] = true;
    classObj["disabled"] = (this.props.disabled != null) && this.props.disabled;
    classes = React.addons.classSet(classObj);
    clickFunction = this.props.onClick != null ? this.props.onClick : (function(_this) {
      return function() {
        return _this.showTooltip(_this.props.tooltip);
      };
    })(this);
    return React.createElement("i", {
      "className": classes,
      "onClick": clickFunction
    });
  }
});



},{"./TooltipMixin.coffee":3}],3:[function(_dereq_,module,exports){
var TooltipMixin;

module.exports = TooltipMixin = {
  tooltipExists: function() {
    return this.tooltip != null;
  },
  createTooltip: function() {
    if (this.tooltipExists()) {
      return;
    }
    if (window._oneshopTooltip) {
      return this.tooltip = window._oneshopTooltip;
    }
    this.tooltip = document.createElement('div');
    this.tooltip.textContent = 'Test Tooltip';
    this.tooltip.classList.add('tooltip');
    window._oneshopTooltip = this.tooltip;
    return this.visible = false;
  },
  showTooltip: function(text) {
    var boundingBox, documentWidth, tooltipHeight;
    if (!text) {
      return;
    }
    if (this.visible) {
      return;
    }
    React.render(text, this.tooltip);
    document.body.appendChild(this.tooltip);
    boundingBox = this.getDOMNode().getBoundingClientRect();
    tooltipHeight = this.tooltip.getBoundingClientRect().height;
    this.tooltip.style.top = window.scrollY + boundingBox.top - (0.5 * tooltipHeight);
    documentWidth = document.body.getBoundingClientRect().width;
    if ((documentWidth - boundingBox.right) > 150) {
      this.tooltip.style.right = null;
      this.tooltip.style.left = boundingBox.left;
    } else {
      this.tooltip.style.right = documentWidth - boundingBox.right;
      this.tooltip.style.left = null;
    }
    return this.visible = true;
  },
  hideTooltip: function() {
    if (!this.visible) {
      return;
    }
    document.body.removeChild(this.tooltip);
    return this.visible = false;
  },
  componentDidMount: function() {
    var el;
    this.createTooltip();
    el = this.getDOMNode();
    el.addEventListener('mouseenter', this.mouseenter, false);
    return el.addEventListener('mouseleave', this.mouseleave, false);
  },
  componentWillUnmount: function() {
    var el;
    this.hideTooltip();
    el = this.getDOMNode();
    el.removeEventListener('mouseenter', this.mouseenter);
    return el.removeEventListener('mouseleave', this.mouseleave);
  },
  mouseenter: function() {
    return this.showTooltip(this.props.tooltip || this.state.tooltip || null);
  },
  mouseleave: function() {
    return this.hideTooltip();
  }
};



},{}]},{},[1])
(1)
});