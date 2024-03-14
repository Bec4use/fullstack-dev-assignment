import { Input } from "./ui/input";
import { Search } from "lucide-react";

const SeachInput = () => {
  return (
    <div className="relative sm:block hidden">
      <Search className="absolute h-4 w-4 top-2.5 left-4 text-muted-foreground" />
      <Input placeholder="Search" className="pl-10 bg-primary/10" />
    </div>
  );
};

export default SeachInput;
