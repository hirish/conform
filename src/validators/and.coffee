module.exports = (validators) ->
		(m) ->
			errors = validators
				.map (validator) -> validator m
				.filter (error) -> error
			if errors.length isnt 0
				return errors
