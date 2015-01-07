module.exports = (regex, errorMessage) ->
	(value) =>
		defaultMessage = "#{value} did not match regex: #{regex}."
		if not value.match regex then return errorMessage or defaultMessage
