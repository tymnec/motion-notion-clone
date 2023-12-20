"use client";

// Import necessary modules and components
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

/**
 * Interface for Navbar component props.
 */
interface NavbarProps {
  /**
   * Flag indicating whether the navbar is collapsed or not.
   */
  isCollapsed: boolean;

  /**
   * Callback function to reset the width of the navbar.
   */
  onResetWidth: () => void;
}

/**
 * Renders the Navbar component.
 *
 * @param {boolean} isCollapsed - Flag indicating whether the Navbar is collapsed.
 * @param {Function} onResetWidth - Callback function to reset the width of the Navbar.
 * @return {JSX.Element} The rendered Navbar component.
 */
export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  // Get the document ID from the URL
  const params = useParams();

  // Get the document from the Convex API
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-11/12 mx-auto flex items-center gap-x-4 bg-stone-50 rounded-3xl m-3 shadow">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground bg-stone-50 drop-shadow rounded border"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};
