"use client";

// Import necessary modules and components
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { UserItem } from "./user-item";
import { Item } from "./item";
import { DocumentList } from "./document-list";
import { TrashBox } from "./trash-box";
import { Navbar } from "./navbar";
import { Separator } from "@/components/ui/separator";

/**
 * Renders the navigation component.
 *
 * @return {void}
 */
export const Navigation = () => {
  // Get the router instance
  const router = useRouter();

  // Get the settings and search hooks
  const settings = useSettings();
  const search = useSearch();

  /**
   * Hook that returns the URL parameters from the current route.
   */
  const params = useParams();

  /**
   * Hook that returns the current pathname.
   */
  const pathname = usePathname();

  /**
   * Hook that returns whether the screen width is below 768px (mobile).
   */
  const isMobile = useMediaQuery("(max-width: 768px)");

  /**
   * Mutation hook that creates a document using the API.
   */
  const create = useMutation(api.documents.create);

  /**
   * Ref that indicates whether the user is currently resizing.
   */
  const isResizingRef = useRef(false);

  /**
   * Ref to the sidebar element.
   */
  const sidebarRef = useRef<ElementRef<"aside">>(null);

  /**
   * Ref to the navbar element.
   */
  const navbarRef = useRef<ElementRef<"div">>(null);

  /**
   * State that indicates whether the app is currently resetting.
   */
  const [isResetting, setIsResetting] = useState(false);

  /**
   * State that indicates whether the sidebar is currently collapsed.
   * Initially set based on the screen width.
   */
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  /**
   * This useEffect hook is responsible for handling the behavior when the 'isMobile' state changes.
   * If 'isMobile' is true, it calls the 'collapse' function.
   * If 'isMobile' is false, it calls the 'resetWidth' function.
   */
  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  /**
   * This useEffect hook is responsible for handling the behavior when either the 'pathname' or 'isMobile' state changes.
   * If 'isMobile' is true, it calls the 'collapse' function.
   */
  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  /**
   * Handles the mouse down event.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The mouse down event.
   */
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  /**
   * Handles the mouse move event.
   *
   * @param {MouseEvent} event - The mouse move event.
   */
  const handleMouseMove = (event: MouseEvent) => {
    // Check if resizing is currently happening
    if (!isResizingRef.current) return;

    // Get the new width based on the clientX value of the event
    let newWidth = event.clientX;

    // Make sure the new width is within the specified range
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    // Update the width of the sidebar and the left position and width of the navbar
    if (sidebarRef.current && navbarRef.current) {
      // Set the width of the sidebar
      sidebarRef.current.style.width = `${newWidth}px`;

      // Set the left position of the navbar
      navbarRef.current.style.setProperty("left", `${newWidth}px`);

      // Set the width of the navbar using the new width of the sidebar
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  /**
   * Handles the mouse up event.
   *
   * @return {void}
   */
  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  /**
   * Resets the width of the sidebar and navbar.
   *
   * @return {void} No return value.
   */
  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  /**
   * Collapses the sidebar and expands the navbar.
   *
   * @return {void} This function does not return anything.
   */
  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  /**
   * Function to handle the creation of a new note.
   *
   * @return {void} No return value.
   */
  const handleCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full p-3 m-4 rounded-3xl bg-secondary overflow-y-auto relative flex w-60 flex-col z-[2] shadow-md",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0",
          isCollapsed && "w-0 hidden"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <div className="rounded-3xl shadow my-2 bg-white dark:bg-neutral-900">
            <UserItem />
          </div>
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} icon={Plus} label="Add a page" />

          <Separator className="dark:bg-neutral-600" />

          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[5] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
