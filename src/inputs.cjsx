{ReactValidation} = require './validation.coffee'

input = React.createClass
	mixins: [ ReactValidation.text() ]

	getInitialState: ->
		valid: true

	onBlur: (event, reactId) ->
		@validate event
		if @props.onBlur then @props.onBlur event, reactId

	render: ->
		c = if not @state.valid then ' invalid' else ''
		<input {...@props} ref='value' className={@props.className + c} onBlur={@onBlur} />

form = React.createClass
	mixins: [ ReactValidation.form() ]

	onSubmit: (event, reactId) ->
		valid = _.every(_.map @conformRegistered, (node) -> node.validate node.value())

		if valid and @props.onSubmit
			event.preventDefault()
			@props.onSubmit event, reactId
		else if not valid
			event.preventDefault()

	render: ->
		<form {...@props} onSubmit={@onSubmit}>{@props.children}</form>
		

module.exports = {input, form}
