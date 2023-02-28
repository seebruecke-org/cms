/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { isEmpty } from 'lodash';
import { Label, InputDescription, InputErrors } from 'strapi-helper-plugin';
import Editor from '../CKEditor';

const Wysiwyg = ({
  inputDescription,
  errors,
  label,
  name,
  noErrorsDescription,
  onChange,
  value,
}) => (
  <div
    style={{
      marginBottom: '1.6rem',
      fontSize: '1.3rem',
      fontFamily: 'Lato',
    }}
  >
    <Label htmlFor={name} message={label} style={{ marginBottom: '1.4rem' }} />
    <Editor name={name} onChange={onChange} value={value} />
    <InputDescription
      message={inputDescription}
      style={!isEmpty(inputDescription) ? { marginTop: '1.4rem' } : {}}
    />
    <InputErrors errors={(!noErrorsDescription && errors) || []} name={name} />
  </div>
);

export default Wysiwyg;
