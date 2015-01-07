module.exports = (size, errorMessage) ->
	(value) =>
		defaultMessage = "Must be longer than #{size} characters."
		if value.length < size then return errorMessage or defaultMessage
