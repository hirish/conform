lengthValidator = require './length.coffee'

module.exports = (m) ->
		lengthValidator 1, m or "Value is required."
