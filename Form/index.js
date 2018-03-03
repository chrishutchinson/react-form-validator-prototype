// @flow
import React from "react";
import PropTypes from "prop-types";
import { ok, err, all, some, isOK, getErrors } from "@times/data-validator";
import type { Validator } from "@times/data-validator";

const FORM_CONTEXT = "__form-thing__";

// Our wrapper function for creating custom components
const withForm = Component => {
  const Wrapper = (props, context) => {
    const formContext = context[FORM_CONTEXT];

    if (props.name && props.validator)
      formContext.registerValidator(props.name, props.validator);

    return <Component {...formContext} {...props} />;
  };
  Wrapper.contextTypes = {
    [FORM_CONTEXT]: PropTypes.object.isRequired
  };
  return Wrapper;
};

const TextInput = withForm(({ isValid, name, onChange }) => (
  <input
    type="text"
    onChange={e => onChange(name, e.target.value)}
    name={name}
  />
));

const ContentEditable = withForm(({ isValid, name, onChange }) => (
  <div contentEditable={true} onInput={e => onChange(name, e.target.innerHTML)}>
    Hello, world!
  </div>
));

class FormWrapper extends React.Component {
  static TextInput = TextInput;

  // Setup our context data model
  static childContextTypes = {
    [FORM_CONTEXT]: PropTypes.object.isRequired
  };

  static defaultProps = {
    compositionReducer: all
  };

  state = {
    data: {},
    isValid: null,
    validators: []
  };

  registerFieldValidator = (fieldName, validator) => {
    const { validators } = this.state;
    if (validators.hasOwnProperty(fieldName)) return;

    this.setState(({ validators }) => ({
      validators: {
        ...validators,
        [fieldName]: validator
      }
    }));
  };

  handleFieldChange = (fieldName, value) => {
    const { validator } = this.props;

    this.setState(
      ({ data }) => ({
        data: {
          ...data,
          [fieldName]: value
        }
      }),
      this.validate
    );
  };

  validate = () => {
    const { compositionReducer } = this.props;
    const { data, validators } = this.state;

    const result = compositionReducer(Object.values(validators))(data);

    this.setState(() => ({
      isValid: result
    }));
  };

  handleSubmit = e => {
    const { onSubmit, validator } = this.props;
    const { data } = this.state;
    const result = validator(data);

    if (!result.valid) e.preventDefault();
    else onSubmit(data);
  };

  // More context setup
  getChildContext() {
    const { isValid } = this.state;

    return {
      [FORM_CONTEXT]: {
        isValid,
        onChange: this.handleFieldChange,
        registerValidator: this.registerFieldValidator
      }
    };
  }

  render() {
    const { children } = this.props;
    const { isValid } = this.state;

    return <form onSubmit={this.handleSubmit}>{children(isValid)}</form>;
  }
}

type FormProps = {};
export default (props: FormProps) => (
  <FormWrapper onSubmit={console.log} compositionReducer={some}>
    {result => (
      <div>
        <p>Is valid?: {result && isOK(result) ? "Yes" : "No"}</p>
        <p>Errors?: {result && getErrors(result).join(", ")}</p>

        <FormWrapper.TextInput
          validator={({ firstName }) =>
            firstName && firstName.length > 2
              ? ok()
              : err(["First name not long enough"])
          }
          name="firstName"
        />

        <FormWrapper.TextInput
          validator={({ lastName }) =>
            lastName && lastName.length > 2
              ? ok()
              : err(["Last name not long enough"])
          }
          name="lastName"
        />

        {/* <ContentEditable
          validator={({ html }) =>
            html.startsWith("Hello") ? ok() : err(['Must start with "Hello"'])
          }
          name="html"
        /> */}

        <input type="submit" />
      </div>
    )}
  </FormWrapper>
);
