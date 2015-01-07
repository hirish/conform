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

module.exports = Validators =
	None: -> return

	Or: require './or.coffee'
	And: require './and.coffee'

	Regex: require './regex.coffee'
	Length: require './length.coffee'
	Required: require './required.coffee'
	Alpha: require './alpha.coffee'
	AlphaNumeric: require './alphaNumeric.coffee'

	Password: require './password.coffee'
	Price: require './price.coffee'

	Card: (m) ->
	CVV: (m) ->
		_regexValidator /^\d{3,4}$/, m or "Invalid CVV"

	Web: require './Web.coffee'

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
