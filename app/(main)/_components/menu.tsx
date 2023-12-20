"use client";

// Import necessary modules and components

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { MoreHorizontal, Trash } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Interface for the Menu component props.
 */
interface MenuProps {
  /**
   * The ID of the document.
   */
  documentId: Id<"documents">;
}

/**
 * Renders a menu component for a document.
 *
 * @param {MenuProps} props - The properties for the menu.
 * @return {JSX.Element} The rendered menu component.
 */
export const Menu = ({ documentId }: MenuProps) => {
  /**
   * Function to handle archiving of documents
   */
  const archive = useMutation(api.documents.archive);

  // Get the router instance
  const router = useRouter();

  // Get the user from useUser hook
  const { user } = useUser();

  /**
   * Executes the onArchive function.
   *
   * @returns {void} - This function does not return anything.
   */
  const onArchive = () => {
    // Call the archive function with the `id` parameter
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });

    router.push("/documents");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Renders a skeleton for the menu.
 *
 * @return {JSX.Element} The rendered skeleton component.
 */
Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
