"use client";

// Import necessary modules and components
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";

/**
 * Renders a component that displays a trash box.
 *
 * @return {JSX.Element} The rendered trash box component.
 */
export const TrashBox = () => {
  // Get the router instance
  const router = useRouter();

  // Get the params
  const params = useParams();

  /**
   * Fetches the documents from the API.
   */
  const documents = useQuery(api.documents.getTrash);

  /**
   * Restores a document.
   */
  const restore = useMutation(api.documents.restore);

  /**
   * Removes a document permanently.
   */
  const remove = useMutation(api.documents.remove);

  // Get the search query
  const [search, setSearch] = useState("");

  /**
   * Filters the documents based on the search query.
   * @param {Object} document - The document object.
   * @returns {boolean} - Whether the document matches the search query.
   */
  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  /**
   * Handles the click event and navigates to the specified document.
   *
   * @param {string} documentId - The ID of the document to navigate to.
   */
  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  /**
   * Handles the restore event.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The event object.
   * @param {Id<"documents">} documentId - The document ID.
   */
  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: " Failed to restore note.",
    });
  };

  /**
   * Removes a document with the specified ID.
   *
   * @param {Id<"documents">} documentId - The ID of the document to be removed.
   */
  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: " Failed to delete note.",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
