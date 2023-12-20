import { Navbar } from "./_components/navbar";

/**
 * Render the MarketingLayout component.
 *
 * @param {React.ReactNode} children - The content to be rendered inside the MarketingLayout component.
 * @return {React.ReactNode} The rendered MarketingLayout component.
 */
const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <Navbar />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};

export default MarketingLayout;
