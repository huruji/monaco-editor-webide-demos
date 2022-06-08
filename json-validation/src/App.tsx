import React from 'react';
import logo from './logo.svg';
import './App.css';
import type { EditorConstructionOptions, monaco } from 'react-monaco-editor';
import Editor, { OnMount } from '@monaco-editor/react';
import { client } from './apiClient'


// 一个给 json 文件添加 babel 提示的例子
const babelJsonSchemaUri = 'https://json.schemastore.org/babelrc.json';


const monacoEditorJSONOptions: EditorConstructionOptions = {
  // readOnly: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  fontSize: 14,
};

const value = {
  'version': 123
};



function App() {

  const onMount: OnMount = async (editor, monaco) => {
    const res = await client.get(babelJsonSchemaUri)
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [{
        uri: babelJsonSchemaUri,
        fileMatch: [editor.getModel?.().uri.toString()],
        schema: res.definitions.Options
      }]
    })
    console.log(monaco)
  }
  return (
    <div className="App">
      <Editor
        height={600}
        language="json"
        value={JSON.stringify(value, null, 2)}
        options={monacoEditorJSONOptions}
        onMount={onMount}
      />
    </div>
  );
}

export default App;
