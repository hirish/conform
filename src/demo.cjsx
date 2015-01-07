Icon = require '../../oneshop/coffee/utils/Icon.cjsx'

submit =
	WAITING: 1
	SUCCESS: 2


module.exports = Demo = React.createClass
	mixins: [React.addons.LinkedStateMixin]

	getInitialState: ->
		submitState: submit.WAITING
		errors: {}

	onValidate: (name) ->
		(valid, errorMessage, value) =>
			@state.errors[name] = if valid then null else errorMessage
			@setState errors: @state.errors
	
	onSubmit: ->
		@setState submitState: submit.SUCCESS
		setTimeout (=>
			@setState
				submitState: submit.WAITING
				username: ''
				email: ''
				password: ''
				confirm: ''
		), 1000
	
	render: ->
		errorIcon = (name) =>
			if @state.errors[name]?
				error = <span>{@state.errors[name].map (error) -> <div key={error}>{error}</div>}</span>
				<Icon icon="exclamation-circle" classes="input" tooltip={error} />

		confirmValidator = (value) =>
			if value isnt (@state.password or '') then return "Does not match password."

		submitButton =
			if @state.submitState is submit.WAITING
				<input type="submit" value="Submit" className="button-primary" />
			else if @state.submitState is submit.SUCCESS
				<input type="submit" value="Success!" className="button-primary success" />

		<Conform.form onSubmit={@onSubmit}>

			<label>Username</label>
			<Conform.input
				type="text"
				validator={[
					Conform.Validators.Required()
					Conform.Validators.Length(4)
					Conform.Validators.AlphaNumeric()
				]}
				onValidate={@onValidate 'username'}
				valueLink={@linkState 'username'}
				placeholder="Desired Username"
				className="u-full-width"
				/>
			{errorIcon 'username'}

			<label>Email</label>
			<Conform.input
				placeholder="username@domain.com"
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

			<label />

			{submitButton}

		</Conform.form>

$container = document.getElementById 'react-base'
React.render <Demo />, $container
