module.exports = (validators) ->
	(m) ->
		errors = validators
			.map (validator) -> validator m
			.filter (error) -> error
		if errors.length is validators.length
			return errors
