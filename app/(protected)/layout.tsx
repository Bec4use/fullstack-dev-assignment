import NavBar from "@/components/layout/NavBar";
import Container from "@/components/Container";
import LocationFilter from "@/components/LocationFilter";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10">
      <NavBar />
      {/* <LocationFilter /> */}
      {/* <Navbar /> This is Menu for User and Admin settings */}
      <Container>{children}</Container>
    </div>
  );
};

export default ProtectedLayout;
