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
			valid


module.exports = ReactValidation
