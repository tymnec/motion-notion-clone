/**
 * Generates a public layout with the given children.
 *
 * @param {React.ReactNode} children - The children to be rendered inside the layout.
 * @return {JSX.Element} The public layout component.
 */
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-screen dark:bg-[#1F1F1F]">{children}</div>;
};

export default PublicLayout;
