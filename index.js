// @flow

import React from "react";
import ReactDOM from "react-dom";

import Form from "./Form";

const container = document.getElementById("app");
if (container) ReactDOM.render(<Form />, container);
