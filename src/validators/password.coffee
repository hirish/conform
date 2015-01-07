regexValidator = require './regex.coffee'

module.exports = (m) ->
	regexValidator /(?=^.{7,}$)(?=.*[^A-Za-z ]).*$/, m or "Password must be longer than 7 characters and contain at least 1 special character."
