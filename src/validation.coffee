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
				errors = errors.concat errorMessage

		isValid = errors.length is 0

		validateCb = @props.onValidate or (valid, errorMessage, value) -> console.error "onValidate is not defined.", errorMessage

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

			@_owner._conformRegisterInput = conformRegisterInput

	@text: ->
		componentDidMount: ->
			registerWithNode = (node) =>
				if node._conformRegisterInput?
					node._conformRegisterInput @
				else if node._owner?
					registerWithNode node._owner

			registerWithNode @

		value: ->
			return @props.value if @props.value?
			input = @refs.value
			input.getDOMNode().value

		validate: (x) ->
			value = if x.target? then x.target.value else x
			valid = do ReactValidation._validate.bind @, value
			@setState valid: valid


_regexValidator = (regex, errorMessage) ->
	(value) =>
		defaultMessage = "#{value} did not match regex: #{regex}."
		if not value.match regex then return errorMessage or defaultMessage

_lengthValidator = (size, errorMessage) ->
	(value) =>
		defaultMessage = "Must be longer than #{size} characters."
		if value.length < size then return errorMessage or defaultMessage

_concat = (validators) ->
	(value) ->
		errors = (validator value for validator in validators when validator value)
		if errors.length > 0 then return errors

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
			_regexValidator /^[a-zA-Z0-9]+$/, m or "Can only contain alphanumeric characters."
	Password: (m) ->
		_regexValidator /(?=^.{7,}$)(?=.*\d).*$/, m or "Password must be longer than 7 characters and contain at least 1 number."
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
		# Zurb Foundation - Abide
		URL: ->
			_regexValidator /(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/
		Domain: ->
			_regexValidator /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/
		IP: ->
			_regexValidator /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
	Color: ->
	# Zurb Foundation - Abide
	DateTime:
		DateTime: ->
			_regexValidator /([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/
		# YYYY-MM-DD
		Date: ->
			_regexValidator /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/
		# HH:MM:SS
		Time: ->
			_regexValidator /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/
		DateISO: ->
			_regexValidator /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/
	Contact:
		# http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		Email: ->  
			_regexValidator /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, "Not a valid email."

		USState: ->
		Zip: (m) ->
			_regexValidator /(^\d{5}$)|(^\d{5}-\d{4}$)/, m or "Invalid Zip Code"
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

module.exports = {ReactValidation, Validators}
