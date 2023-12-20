"use client";

// Import necessary modules and components
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Props for the DocumentIdPage component.
 */
interface DocumentIdPageProps {
  /**
   * The parameters for the component.
   */
  params: {
    /**
     * The document ID.
     */
    documentId: Id<"documents">;
  };
}

/**
 * Renders the DocumentIdPage component.
 *
 * @param {DocumentIdPageProps} params - The props object containing the parameters.
 * @return {JSX.Element} The rendered DocumentIdPage component.
 */
const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  /**
   * A function that is called when the content changes.
   *
   * @param {string} content - The new content value.
   * @return {void} This function does not return anything.
   */
  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40  h-[calc(100vh-5.5rem)] bg-stone-50/30 dark:bg-neutral-800 mx-2 mb-3 rounded-3xl mt-20 shadow-md border">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
