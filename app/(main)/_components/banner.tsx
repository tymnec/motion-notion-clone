"use client";

// Import necessary libraries and components

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

/**
 * Represents the properties of a banner.
 */
interface BannerProps {
  /**
   * The ID of the document.
   */
  documentId: Id<"documents">;
}

/**
 * Renders a banner component for a document.
 *
 * @param {BannerProps} - The properties for the banner component.
 * @return {JSX.Element} - The rendered banner component.
 */
export const Banner = ({ documentId }: BannerProps) => {
  // Define the 'router' hook
  const router = useRouter();

  // Define the 'remove' mutation
  const remove = useMutation(api.documents.remove);

  // Define the 'restore' mutation
  const restore = useMutation(api.documents.restore);

  /**
   * Executes the handleRemove function.
   *
   * @return {void} Does not return a value
   */
  const handleRemove = () => {
    // Remove the note with the given ID
    const promise = remove({ id: documentId });

    // Show a toast notification while the note is being deleted
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });

    // Redirect the user to the "/documents" page after deleting the note
    router.push("/documents");
  };

  /**
   * Executes the handleRestore function.
   *
   * @return {Promise<void>} A promise that resolves when the note is restored successfully, or rejects with an error message if the restoration fails.
   */
  const handleRestore = () => {
    // Restore the note with the given document ID
    const promise = restore({ id: documentId });

    // Show a toast with a loading message while the note is being restored
    // Once the promise is resolved, show a success message if the note is restored
    // If the promise is rejected, show an error message
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
         <p>This page is in the Trash.</p>
         <Button
           size="sm"
           onClick={handleRestore}
           variant="outline"
           className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
         >
           Restore page
         </Button>
         <ConfirmModal onConfirm={handleRemove}>
           <Button
             size="sm"
             variant="outline"
             className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
           >
             Delete forever
           </Button>
         </ConfirmModal>
       </div>
  );
};
