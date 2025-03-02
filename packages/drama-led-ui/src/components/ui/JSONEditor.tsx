"use client";

import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  onChange: (code: string) => void;
};

export default function JSONEditor({ code, onChange }: Props) {
  // @ts-ignore
  const onMount = (editor) => {
    editor.updateOptions({
      tabSize: 2,
      selectionClipboard: false,
    });
  };

  const handleEditorChange = (code: string | undefined) => {
    if (code == null) {
      return;
    }

    onChange(code);
  };

  return (
    <Editor
      defaultLanguage="json"
      value={code}
      onChange={handleEditorChange}
      onMount={onMount}
      options={{}}
    />
  );
}
