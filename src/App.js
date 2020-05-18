import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { v4 } from 'uuid';

import axios from 'axios';
import useInterval from './use-interval';

const URL = 'http://localhost:3001/collab';

const ID = v4();

const DEFAULT_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

const CollabEditor = ({ readOnly, value, onSave, stopEditing }) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const onChange = (value) => {
    if (!editor.selection) stopEditing();
    onSave(value);
  };

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <br />
      <Editable readOnly={readOnly} />
    </Slate>
  );
};

const App = () => {
  const [readOnly, setReadonly] = useState(false);
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [id, setId] = useState(false);
  // Add the initial value when setting up our state.

  useInterval(() => {
    axios.get(URL).then((res) => {
      if (res.data.id && res.data.id !== ID) {
        setReadonly(true);
        setValue(res.data.value);
      } else {
        setReadonly(false);
      }
      setId(res.data.id);
    });
  }, 500);

  const onSave = (value) => {
    axios.post(URL, { id: ID, value: value });
    setValue(value);
  };

  const stopEditing = () => {
    axios.delete(URL);
  };

  return (
    <div>
      {id === ID ? 'you' : id} is editing readOnly=
      {readOnly ? 'true' : 'false'}
      <br />
      <br />
      <CollabEditor
        readOnly={readOnly}
        value={value}
        onSave={onSave}
        stopEditing={stopEditing}
      />
    </div>
  );
};

export default App;
