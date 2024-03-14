import NavBar from "@/components/layout/NavBar";
import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10">
      <NavBar />
      {/* <Navbar /> This is Menu for User and Admin settings */}
      {children}
    </div>
  );
};

export default ProtectedLayout;
