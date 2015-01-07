regexValidator = require './regex.coffee'

module.exports = (m) ->
	regexValidator /^[a-zA-Z]+$/, m or "Can only contain alphabet characters."
