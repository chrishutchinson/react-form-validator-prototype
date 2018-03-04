// @flow
import * as React from "react";

import withForm from "./with-form";
import type { OnChange } from "./index";

type TextInputProps = {
  name: string,
  onChange: OnChange
};
export const TextInput = withForm(({ name, onChange }: TextInputProps) => (
  <input
    type="text"
    onChange={(e: Event) => {
      if (e.target instanceof HTMLInputElement) onChange(name, e.target.value);
    }}
    name={name}
  />
));

type SelectInputProps = {
  name: string,
  children: React.Node,
  onChange: OnChange,
  defaultValue: mixed
};
export const SelectInput = withForm(
  ({ name, children, onChange, defaultValue }: SelectInputProps) => (
    <select
      defaultValue={defaultValue}
      onChange={(e: Event) => {
        if (e.target instanceof HTMLSelectElement)
          onChange(name, e.target.value);
      }}
      name={name}
    >
      {children}
    </select>
  )
);

type ContentEditableProps = {
  name: string,
  onChange: OnChange
};
export const ContentEditable = withForm(
  ({ name, onChange }: ContentEditableProps) => (
    <div
      contentEditable={true}
      onChange={(e: Event) => {
        if (e.target instanceof HTMLElement) onChange(name, e.target.innerHTML);
      }}
    >
      Hello, world!
    </div>
  )
);
