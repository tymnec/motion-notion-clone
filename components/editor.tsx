"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

/**
 * Renders an Editor component.
 *
 * @param {EditorProps} onChange - a function to handle content changes
 * @param {string} initialContent - the initial content of the editor
 * @param {boolean} editable - whether the editor is editable or not
 * @return {JSX.Element} the rendered Editor component
 */
const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  /**
   * Handles the upload of a file.
   *
   * @param {File} file - The file to be uploaded.
   * @return {string} The URL of the uploaded file.
   */
  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    /**
     * A description of the entire function.
     *
     * @param {type} editor - description of parameter
     * @return {type} description of return value
     */
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
