`/** @jsx React.DOM */`

{ReactValidation} = require './validation.coffee'

ValidatedInput = React.createClass
  mixins: [ ReactValidation.text() ]

  onBlur: (event, reactId) ->
    @validate event
    if @props.onBlur then @props.onBlur event, reactId

  render: ->
    @transferPropsTo `<input onBlur={this.onBlur} />`

ValidatedForm = React.createClass
  mixins: [ ReactValidation.form() ]

  onSubmit: (event, reactId) ->
    valid = _.every(_.map @conformRegistered, (node) -> node.validate node.value())

    if valid and @props.onSubmit
        @props.onSubmit event, reactId
    else
        valid

  render: ->
    @transferPropsTo `<form onSubmit={this.onSubmit}>{this.props.children}</form>`

module.exports = {ValidatedInput, ValidatedForm}
