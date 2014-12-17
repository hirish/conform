Icon = require '../../oneshop/coffee/utils/Icon.cjsx'

module.exports = Demo = React.createClass
	mixins: [React.addons.LinkedStateMixin]

	getInitialState: ->
		errors: {}

	onValidate: (name) ->
		(valid, errorMessage, value) =>
			@state.errors[name] = if valid then null else errorMessage
			@setState errors: @state.errors
	
	onSubmit: ->
		console.log "Successfully submitted"
	
	render: ->
		errorIcon = (name) =>
			if @state.errors[name]?
				error = <span>{@state.errors[name].map (error) -> <div key={error}>{error}</div>}</span>
				<Icon icon="exclamation-circle" classes="input" tooltip={error} />

		confirmValidator = (value) =>
			if value isnt (@state.password or '') then return "Does not match password."

		<Conform.form onSubmit={@onSubmit}>

			<label>Username</label>
			<Conform.input
				type="text"
				validator={[
					Conform.Validators.Basic.Required()
					Conform.Validators.Basic.Length(4)
					Conform.Validators.Basic.AlphaNumeric()
				]}
				onValidate={@onValidate 'username'}
				valueLink={@linkState 'username'}
				placeholder="This is a really really long placeholder"
				className="u-full-width"
				/>
			{errorIcon 'username'}

			<label>Email</label>
			<Conform.input
				placeholder="username@doman.com"
				type="text"
				validator={Conform.Validators.Contact.Email()}
				onValidate={@onValidate 'email'}
				valueLink={@linkState 'email'}
				className="u-full-width"
				/>
			{errorIcon 'email'}

			<label>Password</label>
			<Conform.input
				type="password"
				validator={Conform.Validators.Password()}
				onValidate={@onValidate 'password'}
				valueLink={@linkState 'password'}
				className="u-full-width"
				/>
			{errorIcon 'password'}

			<label>Confirm Your Password</label>
			<Conform.input
				type="password"
				validator={confirmValidator}
				onValidate={@onValidate 'confirm'}
				valueLink={@linkState 'confirm'}
				className="u-full-width"
				/>
			{errorIcon 'confirm'}

			<input type="submit" value="Submit" className="button-primary" />

		</Conform.form>

$container = document.getElementById 'react-base'
React.render <Demo />, $container
