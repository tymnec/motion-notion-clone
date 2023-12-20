"use client";

// Import necessary modules and components
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { SearchCommand } from "@/components/search-command";
import { Navigation } from "./_components/navigation";

/**
 * Renders the main layout of the application.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components.
 * @return {React.ReactNode} The rendered main layout.
 */
const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return ( 
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
   );
}
 
export default MainLayout;