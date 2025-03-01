"use client";

import Editor from "react-simple-code-editor";

import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

type Props = {
  code: string;
  onChange: (code: string) => void;
};

export default function JSONEditor({ code, onChange }: Props) {
  return (
    <Editor
      value={code}
      onValueChange={onChange}
      highlight={(code) => highlight(code, languages.js, "javascript")}
      padding={4}
      className="h-full"
      insertSpaces={true}
      tabSize={2}
      style={{
        fontFamily: "monospace",
        fontSize: 12,
      }}
    />
  );
}
