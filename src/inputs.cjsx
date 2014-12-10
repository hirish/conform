{ReactValidation} = require './validation.coffee'

Input = React.createClass
	mixins: [ ReactValidation.text() ]

	onBlur: (event, reactId) ->
		@validate event
		if @props.onBlur then @props.onBlur event, reactId

	render: ->
		<input ref='value' onBlur={@onBlur} {...@props} />

Form = React.createClass
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
		

module.exports = {Input, Form}
