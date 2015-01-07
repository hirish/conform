module.exports = (m) ->
	regexValidator /^[$£€]?\d+(?:\.\d\d)?$/, m or "Invalid Price"
