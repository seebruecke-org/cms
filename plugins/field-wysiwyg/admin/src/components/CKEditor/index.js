/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor';
import styled from 'styled-components';

const Editor = ({ onChange, name, value }) => {
  const isCaption = name.endsWith('caption');

  const Wrapper = styled.div`
  .ck-editor__main {
    font-size: 1.5rem;
    line-height: 1.45;
    min-height: ${isCaption ? '90px' : '200px'};

    > div {
      min-height: ${isCaption ? '90px' : '200px'};
    }
  }
`;

  const configuration = {
    toolbar: [
      ...(!isCaption ? ['heading'] : []),
      ...(!isCaption ? ['|'] : []),
      ...(!isCaption ? ['bold'] : []),
      ...(!isCaption ? ['italic'] : []),
      'link',
      ...(!isCaption ? ['bulletedList'] : []),
      ...(!isCaption ? ['numberedList'] : []),
      ...(!isCaption ? ['|'] : []),
      ...(!isCaption ? ['undo'] : []),
      ...(!isCaption ? ['redo'] : []),
    ],
  };

  return (
    <Wrapper>
      <CKEditor
        editor={CustomEditor}
        config={configuration}
        data={value}
        onBlur={(event, editor) => {
          console.log('save', editor.getData())
          onChange({ target: { name, value: editor.getData() } });
        }}
      />
    </Wrapper>
  );
};

export default Editor;
