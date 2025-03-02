"use client";

import Editor from "@monaco-editor/react";
import { useRef } from "react";
// import { editor, Uri, MarkerSeverity } from "monaco-editor";
import { InputMessage } from "@spencer516/drama-led-messages/src/InputMessage";

type Props = {
  code: string;
  onChange: (code: string) => void;
};

type ErrorLocation = {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
};

function findErrorLocation(
  jsonString: string,
  path: (number | string)[],
): ErrorLocation {
  return {
    startLineNumber: 1,
    endLineNumber: 1,
    startColumn: 1,
    endColumn: 1,
  };
}

export default function JSONEditor({ code, onChange }: Props) {
  // const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // const onMount = (editor: editor.IStandaloneCodeEditor) => {
  //   editorRef.current = editor;
  // };

  // const validateJSON = (jsonString: string) => {
  //   try {
  //     const parsedJson = JSON.parse(jsonString);
  //     const result = InputMessage.safeParse(parsedJson);
  //     const currentEditor = editorRef.current;

  //     if (currentEditor == null) {
  //       return;
  //     }

  //     // Clear any validation markers
  //     editor.setModelMarkers(currentEditor.getModel()!, "validation", []);

  //     if (result.success) {
  //       return;
  //     }

  //     const markers: editor.IMarker[] = result.error.errors.map((err) => {
  //       const message = err.message;
  //       const errorLocation = findErrorLocation(jsonString, err.path);

  //       return {
  //         severity: MarkerSeverity.Error,
  //         owner: "",
  //         resource: Uri.file("/"),
  //         message,
  //         ...errorLocation,
  //       };
  //     });

  //     editor.setModelMarkers(currentEditor.getModel()!, "validation", markers);
  //   } catch (e) {
  //     // Do nothing...Monaco handles JSON errors already.
  //   }
  // };

  const handleEditorChange = (code: string | undefined) => {
    if (code == null) {
      return;
    }

    onChange(code);
    // validateJSON(code);
  };

  // onMount={onMount}
  return (
    <Editor
      defaultLanguage="json"
      value={code}
      onChange={handleEditorChange}
    />
  );
}
