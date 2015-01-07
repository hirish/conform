regexValidator = require './regex.coffee'

module.exports = (m) ->
	regexValidator /^[a-zA-Z0-9]+$/, m or "Can only contain alphanumeric characters."
