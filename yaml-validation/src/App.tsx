import React from 'react';
import { client } from './apiClient'
import { editor as Editor, Uri }from 'monaco-editor';
import { setDiagnosticsOptions } from 'monaco-yaml';


// 一个给 json 文件添加 babel 提示的例子
const babelJsonSchemaUri = 'https://json.schemastore.org/babelrc.json';

(window as any).MonacoEnvironment = {
  getWorker(moduleId: any, label: any) {
    switch (label) {
      case 'editorWorkerService':
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
      case 'css':
      case 'less':
      case 'scss':
        return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url));
      case 'handlebars':
      case 'html':
      case 'razor':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url),
        );
      case 'json':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url),
        );
      case 'javascript':
      case 'typescript':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url),
        );
      case 'yaml':
        return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
      default:
        throw new Error(`Unknown label ${label}`);
    }
  },
};


(async () => {
  const res = await client.get(babelJsonSchemaUri)
  setDiagnosticsOptions({
    enableSchemaRequest: true,
    hover: true,
    completion: true,
    validate: true,
    format: true,
    schemas: [
      {
        uri: babelJsonSchemaUri,
        fileMatch: ['openapi.yml'],
        schema: res.definitions.Options
      },
    ],
  });
})()


const value = '';

function App() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const model = Editor.createModel(
      value,
      'yaml',
      Uri.parse('openapi.yml'),
    )
    const codeEditor = Editor.create(ref.current!, {
      minimap: {enabled: false},
      language: 'yaml',
      model: model,
    })
    return () => {
      model.dispose()
      codeEditor.dispose()
    }
  }, [])

  return (
    <div className="App" ref={ref} style={{height: '600px'}}>
    </div>
  );
}

export default App;
