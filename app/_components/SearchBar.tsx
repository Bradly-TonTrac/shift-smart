"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const SearchBar = () => {
  const { replace } = useRouter();
  const search = useSearchParams();
  const pathName = usePathname();

  const handleSearch = (employee: string) => {
    const params = new URLSearchParams(search);

    if (employee) {
      params.set("query", employee);
    } else {
      params.delete("query");
    }
    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center">
      <div className="flex items-center ">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupButton />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
};

export default SearchBar;
