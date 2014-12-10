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

		<div>
			<Conform.Form onSubmit={@onSubmit}>
				<h1>Conform Demo</h1>

				<section className="left">
					<label>Username</label>
					<Conform.Input
						type="text"
						validator={[
							Conform.Validators.Basic.Required()
							Conform.Validators.Basic.Length(4)
							Conform.Validators.Basic.AlphaNumeric()
						]}
						onValidate={@onValidate 'username'}
						valueLink={@linkState 'username'}
						/>
					{errorIcon 'username'}

					<label>Email</label>
					<Conform.Input
						placeholder="username@doman.com"
						type="text"
						validator={Conform.Validators.Contact.Email()}
						onValidate={@onValidate 'email'}
						valueLink={@linkState 'email'}
						/>
					{errorIcon 'email'}

					<label>Phone Number</label>
					<Conform.Input
						type="text"
						validator={Conform.Validators.Basic.Required()}
						onValidate={@onValidate 'phone'}
						valueLink={@linkState 'phone'}
						/>
					{errorIcon 'phone'}
				</section>

				<section className="right">
					<label>Price</label>
					<Conform.Input
						placeholder="$0.00"
						type="text"
						validator={Conform.Validators.Payment.Price()}
						onValidate={@onValidate 'price'}
						valueLink={@linkState 'price'}
						/>
					{errorIcon 'price'}

					<label>Credit Card</label>
					<Conform.Input
						type="text"
						validator={Conform.Validators.Basic.Required()}
						onValidate={@onValidate 'card'}
						valueLink={@linkState 'card'}
						/>
					{errorIcon 'card'}
				</section>

				<button>Submit</button>
			</Conform.Form>
		</div>

$container = document.getElementById 'react-base'
React.render <Demo />, $container
