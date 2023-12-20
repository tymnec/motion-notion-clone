"use client";

// Import necessary modules

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Item } from "./item";
/**
 * Props for the DocumentList component.
 */
interface DocumentListProps {
  /**
   * The ID of the parent document.
   */
  parentDocumentId?: Id<"documents">;

  /**
   * The level of the document.
   */
  level?: number;

  /**
   * The data for the document.
   */
  data?: Doc<"documents">[];
}

/**
 * Renders a list of documents in a hierarchical structure.
 *
 * @param {string} parentDocumentId - The ID of the parent document.
 * @param {number} [level=0] - The nesting level of the document list.
 * @return {ReactElement} The rendered document list.
 */
export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  // Define state variables
  const params = useParams();

  // Define the 'router' hook
  const router = useRouter();

  // Define the 'expanded' state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /**
   * Toggles the expanded state for a document.
   *
   * @param {string} documentId - The ID of the document.
   * @return {void}
   */
  const toggleExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  // Define the 'documents' query
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  /**
   * Redirects the user to the specified document.
   *
   * @param {string} documentId - The ID of the document to be redirected to.
   */
  const redirectToDocument = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => redirectToDocument(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => toggleExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
