// @flow
import React from "react";
import PropTypes from "prop-types";

export const FORM_CONTEXT = "__validator-form__";

type Wrapper = (Object, *) => React$Element<*>;
type WithForm = Function => Wrapper;
// Our wrapper function for creating custom components
const withForm: WithForm = Component => {
  const Wrapper: Wrapper = (props, context) => {
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

export default withForm;
