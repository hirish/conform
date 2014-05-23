`/** @jsx React.DOM */`

#
# Main Validation Function
#

class ReactValidation
  @_validate: (value) ->
    errors = []

    validators =
      if @props.validator instanceof Function
        [@props.validator]
      else if @props.validator instanceof Array
        @props.validator
      else
        []

    for validator in validators
      errorMessage = validator value
      if errorMessage?
        errors.push errorMessage

    isValid = errors.length is 0

    validateCb = @props.onValidate or (valid, errorMessage, value) -> console.error "Undefined error function.", errorMessage

    validateCb isValid, errors, value

    return isValid

  #
  # Input validators
  #
  @form: ->
    conformRegistered: []

    componentWillMount: ->
        conformRegisterInput = (input) =>
          @conformRegistered.push input

        addRegisterToNode = (node) ->
            node.conformRegisterInput= conformRegisterInput
            if node.props.children then React.Children.forEach node.props.children, addRegisterToNode

        addRegisterToNode @

  @text: ->
    componentDidMount: ->
      registerWithNode = (node) =>
        if node.conformRegisterInput?
          node.conformRegisterInput @
        else if node._owner?
          registerWithNode node._owner

      registerWithNode @

    value: ->
        return @props.value if @props.value?
        input = React.Children.only @props.children
        input.getDOMNode().value

    validate: (x) ->
      value = if x.target? then x.target.value else x
      do ReactValidation._validate.bind @, value


_regexValidator = (regex, errorMessage) ->
  (value) =>
    defaultMessage = "#{value} did not match regex: #{regex}."
    if not value.match regex then return errorMessage or defaultMessage

_lengthValidator = (size, errorMessage) ->
  (value) =>
    defaultMessage = "#{value} was not >= #{size}."
    if value.length < size then return errorMessage or defaultMessage

Validators =
  None: -> return
  Basic:
    Regex: _regexValidator
    Length: _lengthValidator
    Required: (m) ->
        _lengthValidator 1, m or "Value is required."
    Alpha: (m) ->
        _regexValidator /^[a-zA-Z]+$/, m
    AlphaNumeric: (m) ->
        _regexValidator /^[a-zA-Z0-9]+$/, m
  Password:
    Weak: ->
    Medium: (m) ->
        _regexValidator /(?=^.{7,}$)(?=.*\d).*$/, m
    Strong: ->
  Payment:
    Price: (m) ->
        _regexValidator /^[$£€]?\d+(?:\.\d\d)?$/, m or "Invalid Price"
    Card:
      All: ->
      Visa: ->
      MasterCard: ->
    CVV: (m) ->
        _regexValidator /^\d{3,4}$/, m or "Invalid CVV"
  Web:
    URL: ->
    Domain: ->
    IP: ->
  Color: ->
  DateTime:
    DateTime: ->
    Date: ->
    Time: ->
  Contact:
    Email: ->  
    USState: ->
    Zip: (m) ->
        _regexValidator /(^\d{5}$)|(^\d{5}-\d{4}$)/, m or "Invalid Zip Code"
    Phone:
      UK: ->
      USA: ->
      France: ->
  Number:
    Positive: (m) ->
        _regexValidator /^[+]?\d+$/, m or "Must be a positive integer"
    Negative: (m) ->
        _regexValidator /^-\d+$/, m or "Must be a negative integer"
    Integer: (m) ->
        _regexValidator /^[+-]?\d+$/, m or "Must be an integer"
    Float: (m) ->
        _regexValidator /^[+-]?\d+.?\d*$/, m or "Must be a float"
    PositiveFloat: (m) ->
        _regexValidator /^[+]?\d+.?\d*$/, m or "Must be a positive float"
    NegativeFloat: (m) ->
        _regexValidator /^-\d+.?\d*$/, m or "Must be a negative float"
    Range: (m) ->

module.exports = {ReactValidation, Validators}
