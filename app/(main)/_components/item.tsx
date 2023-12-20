"use client";

// Import necessary modules and components
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/**
 * Props for the Item component.
 */
interface ItemProps {
  /**
   * The unique identifier for the item.
   */
  id?: Id<"documents">;

  /**
   * The icon for the document.
   */
  documentIcon?: string;

  /**
   * Whether the item is active.
   */
  active?: boolean;

  /**
   * Whether the item is expanded.
   */
  expanded?: boolean;

  /**
   * Whether the item is used for search.
   */
  isSearch?: boolean;

  /**
   * The level of the item in the hierarchy.
   */
  level?: number;

  /**
   * Callback function when the item is expanded.
   */
  onExpand?: () => void;

  /**
   * The label of the item.
   */
  label: string;

  /**
   * Callback function when the item is clicked.
   */
  onClick?: () => void;

  /**
   * The icon for the item.
   */
  icon: LucideIcon;
}

/**
 * Renders an item component.
 *
 * @param {ItemProps} props - The props object containing the following properties:
 *   - id: The ID of the item.
 *   - label: The label of the item.
 *   - onClick: The click event handler for the item.
 *   - icon: The icon component for the item.
 *   - active: A boolean indicating whether the item is active.
 *   - documentIcon: The document icon component for the item.
 *   - isSearch: A boolean indicating whether the item is for search.
 *   - level: The level of the item.
 *   - onExpand: The expand event handler for the item.
 *   - expanded: A boolean indicating whether the item is expanded.
 * @return {JSX.Element} The rendered item component.
 */
export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  // Define state variables
  const { user } = useUser();

  // Define the 'router' hook
  const router = useRouter();

  // Define the 'create' mutation
  const create = useMutation(api.documents.create);

  // Define the 'archive' mutation
  const archive = useMutation(api.documents.archive);

  /**
   * Handles the archive event.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The event object.
   * @return {void} No return value.
   */
  const handleArchive = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    // Stop event propagation
    event.stopPropagation();

    // Check if `id` is falsy
    if (!id) {
      return;
    }

    // Call the archive function with the `id` parameter
    const archivePromise = archive({ id });

    // Navigate to "/documents" after the archive promise resolves
    archivePromise.then(() => router.push("/documents"));

    // Show a toast notification with loading, success, and error messages
    toast.promise(archivePromise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });
  };

  /**
   * Handles the expand event.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The mouse event.
   * @return {void} No return value.
   */
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  /**
   * Creates a new note when the user clicks on a div element.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The mouse event triggered by the click on the div element.
   * @return {void} This function does not return anything.
   */
  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!id) {
      return;
    }

    /**
     * Creates a new note.
     *
     * @return {Promise<void>} - A promise that resolves when the note is created.
     */
    const createNote = async () => {
      try {
        const documentId = await create({
          title: "Untitled",
          parentDocument: id,
        });

        if (!expanded) {
          onExpand?.();
        }

        router.push(`/documents/${documentId}`);
        toast.success("New note created!");
      } catch (error) {
        toast.error("Failed to create a new note.");
      }
    };

    toast.promise(createNote(), {
      loading: "Creating a new note...",
    });
  };

  // Define the 'ChevronIcon'
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium rounded-2xl my-1",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60 rounded-2xl p-2"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={handleArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Generates a skeleton item for rendering a loading state.
 *
 * @param {Object} props - The props for the ItemSkeleton component.
 * @param {number} props.level - The level of the skeleton item (optional).
 * @return {JSX.Element} - The rendered skeleton item.
 */
Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
