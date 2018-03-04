// @flow
import * as React from "react";
import PropTypes from "prop-types";
import {
  ok,
  err,
  all,
  some,
  isOK,
  getErrors,
  alwaysOK
} from "@times/data-validator";
import type { Validator, Composer, Result } from "@times/data-validator";

import withForm, { FORM_CONTEXT } from "./with-form";
import { TextInput, SelectInput, ContentEditable } from "./components";

// Flow types
export type OnChange = (string, mixed) => mixed;
type RegisterFieldValidator = (string, Validator) => void;
type Data = {
  [string]: any
};
type HandleFieldChange = (string, mixed) => void;
type Validate = () => Result;
type HandleSubmit = Event => void;

// Component types
type Props = {
  composer: Composer,
  onSubmit: Data => mixed,
  children: Result => React.Element<any>
};
type State = {
  data: Data,
  isValid: ?Result,
  validators: {
    [string]: Validator
  }
};
type Context = {
  isValid: Result,
  onChange: OnChange,
  registerValidator: RegisterFieldValidator
};
class ValidatorForm extends React.Component<Props, State> {
  static childContextTypes = {
    [FORM_CONTEXT]: PropTypes.object.isRequired
  };

  static defaultProps = {
    composer: all
  };

  state: State = {
    data: {},
    isValid: null,
    validators: {}
  };

  registerFieldValidator: RegisterFieldValidator = (fieldName, validator) => {
    const { validators } = this.state;
    if (validators.hasOwnProperty(fieldName)) return;

    this.setState(({ validators }) => ({
      validators: {
        ...validators,
        [fieldName]: validator
      }
    }));
  };

  handleFieldChange: HandleFieldChange = (fieldName, value) => {
    this.setState(
      ({ data }) => ({
        data: {
          ...data,
          [fieldName]: value
        }
      }),
      () => {
        const result = this.validate();

        this.setState(() => ({
          isValid: result
        }));
      }
    );
  };

  validate: Validate = () => {
    const { composer } = this.props;
    const { data, validators } = this.state;

    const result = composer(Object.values(validators))(data);

    return result;
  };

  handleSubmit: HandleSubmit = e => {
    const { onSubmit } = this.props;
    const { data } = this.state;

    const result = this.validate();

    if (!result.valid) e.preventDefault();
    else onSubmit(data);
  };

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

export default ValidatorForm;
export { TextInput, SelectInput, ContentEditable, withForm };
