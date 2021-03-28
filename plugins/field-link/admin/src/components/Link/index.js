/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */

import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

import { isEmpty } from 'lodash';
import { InputText } from '@buffetjs/core';
import { Label, InputDescription, InputErrors } from 'strapi-helper-plugin';

export default function Link({
  inputDescription,
  noErrorsDescription,
  label,
  name,
  errors,
  value: defaultValue,
  onChange,
}) {
  const jwtKey = 'jwtToken';
  const jwtToken = JSON.parse(localStorage.getItem(jwtKey) || sessionStorage.getItem(jwtKey));
  let parsedDefaultValue = {};

  try {
    parsedDefaultValue = JSON.parse(defaultValue);
  } catch (err) {
    parsedDefaultValue = {
      url: defaultValue,
    };
  }

  const [store, setStore] = useState(parsedDefaultValue);

  useEffect(() => {
    let finalValue = Object.entries({
      ...store,
      label: store?.label || store?.title || '',
    }).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (finalValue.url || finalValue.title || finalValue.id) {
      finalValue = JSON.stringify(finalValue);
    } else {
      finalValue = '';
    }

    onChange({ target: { name, value: finalValue } });
  }, [store]);

  const loadOptions = (query) => {
    const isURL = query && (query.startsWith('http') || query.startsWith('/'));

    if (isURL) {
      return Promise.resolve([]);
    }

    return fetch('/field-link/suggestions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then(({ hits }) => hits.map(({ id, title, contentType }) => ({
        value: id,
        label: title,
        title,
        id,
        contentType,
      })));
  };

  const onSelectChange = (newValue) => {
    const { label: linkLabel, ...newProps } = newValue;

    setStore((oldStore) => ({
      ...oldStore,
      ...newProps,
      url: undefined,
      label: oldStore?.label || linkLabel,
    }));
  };

  const onBlur = (event) => {
    const value = event?.target?.value;

    if (value) {
      setStore((oldStore) => ({
        label: oldStore?.label || value,
        title: value,
        url: value,
      }));
    }
  };

  const selectStyles = {
    control: (defaultStyles, { isFocused }) => ({
      ...defaultStyles,
      borderColor: isFocused ? 'rgb(120, 202, 255)' : 'rgb(227, 233, 243)',
      boxShadow: '0',
      minHeight: 'none',
      '&:hover': {
        borderColor: 'rgb(227, 233, 243)',
      },
    }),

    menu: (defaultStyles) => ({
      ...defaultStyles,
      borderColor: 'rgb(227, 233, 243)',
      zIndex: 10,
    }),

    option: (defaultStyles, { isFocused }) => ({
      ...defaultStyles,
      backgroundColor: isFocused ? 'rgb(230, 240, 251)' : 'transparent',
      padding: '0.35rem 1rem',
    }),

    noOptionsMessage: (defaultStyles) => ({
      ...defaultStyles,
      fontSize: '1.3rem',
      padding: '0.25rem 1rem',
    }),

    placeholder: (defaultStyles) => ({
      ...defaultStyles,
      color: 'rgb(51, 55, 64)',
      fontSize: '1.3rem',
    }),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    dropdownIndicator: (defaultStyles) => ({
      ...defaultStyles,
      padding: '4px',
    }),

    valueContainer: (defaultStyles) => ({
      ...defaultStyles,
      padding: '0.17rem 1rem',
    }),

    singleValue: (defaultStyles) => ({
      ...defaultStyles,
      fontSize: '1.25rem',
    }),
  };

  return (
    <div>
      <div>
        <Label htmlFor={`${name}_label`} message={label} />
        <div style={{ marginTop: '1.4rem' }}>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            onChange={onSelectChange}
            onBlur={onBlur}
            autoFocus
            placeholder="Search …"
            defaultValue={{ label: store?.title || store?.url || store?.label || '', value: null }}
            name={`${name}_search`}
            styles={selectStyles}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
            })}
          />
        </div>
      </div>

      <div style={{ marginTop: '1.4rem' }}>
        <Label htmlFor={`${name}_label`} message="Label" />
        <InputText
          name={`${name}_label`}
          value={store?.label || ''}
          onChange={(event) => {
            const newLabel = event.target.value;

            setStore((oldStore) => ({
              ...oldStore,
              label: newLabel.length > 0 ? newLabel : oldStore.title,
            }));
          }}
          style={{ marginTop: '1.4rem' }}
        />
      </div>

      <InputDescription
        message={inputDescription}
        style={!isEmpty(inputDescription) ? { marginTop: '1.4rem' } : {}}
      />

      <InputErrors
        errors={(!noErrorsDescription && errors) || []}
        name={name}
      />
    </div>
  );
}
