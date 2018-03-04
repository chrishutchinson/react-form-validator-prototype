// @flow
import React from "react";
import PropTypes from "prop-types";
import { ok, err, all, some, isOK, getErrors } from "@times/data-validator";

import ValidatorForm, { TextInput, SelectInput, withForm } from "../lib/index";

const MyTextarea = withForm(({ name, onChange }) => (
  <textarea onChange={e => onChange(name, e.target.value)} name={name} />
));

export default () => (
  <ValidatorForm onSubmit={console.log} composer={all}>
    {result => (
      <div>
        <p>Is valid?: {result && isOK(result) ? "Yes" : "No"}</p>
        <p>Errors?: {result && getErrors(result).join(", ")}</p>

        <TextInput
          validator={({ firstName }) =>
            firstName && firstName.length > 2
              ? ok()
              : err(["First name not long enough"])
          }
          name="firstName"
        />

        <MyTextarea
          validator={({ body }) =>
            body && body.toLowerCase().startsWith("hello")
              ? ok()
              : err(['Body must start with "Hello"'])
          }
          name="body"
        />

        <TextInput
          validator={({ lastName }) =>
            lastName && lastName.length > 2
              ? ok()
              : err(["Last name not long enough"])
          }
          name="lastName"
        />

        <SelectInput
          validator={({ country }) =>
            country ? ok() : err(["Must select a country"])
          }
          defaultValue=""
          name="country"
        >
          <option value="">--- PLEASE SELECT ---</option>
          <option value="gb">Great Britain</option>
        </SelectInput>

        <input type="submit" />
      </div>
    )}
  </ValidatorForm>
);
