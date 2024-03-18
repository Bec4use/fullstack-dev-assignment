"use client";

import qs from "query-string";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeboundValue } from "@/hook/useDebounceValue";

const SeachInput = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const [value, setValue] = useState(title || "");

  const pathname = usePathname();
  const router = useRouter();

  const debouncedValue = useDeboundValue<string>(value);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  }, [debouncedValue, router]);
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  if (pathname !== "/homepage") return null;

  return (
    <div className="relative sm:block hidden">
      <Search className="absolute h-4 w-4 top-2.5 left-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search Hotels"
        className="pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SeachInput;
