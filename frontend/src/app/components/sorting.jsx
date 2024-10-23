// A dropdown menu button to set the sorting value
import {
  Dropdown, DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger
} from "@nextui-org/dropdown";
import {Button} from "@nextui-org/button";
import TuneTwoToneIcon from "@mui/icons-material/TuneTwoTone";
import {sortOption} from "../constants";
import {useEffect} from "react";

const makeApiRequest = async (param) => {
  // Construct the URL with the query parameter
  const response = await fetch(`http://127.0.0.1:8000/api/database/sorted_data?query=${encodeURIComponent(param)}`);

  if (response.ok) {
    const data = await response.json();
    console.log("Response from backend:", data);
  } else {
    console.error("Failed to fetch:", response.status);
  }
};

export default function Sorting({selectedKeys, setSelectedKeys}) {
  useEffect(() => {
    if (selectedKeys) {
      makeApiRequest(selectedKeys);
    }
  }, [selectedKeys]);
  return (
    <div
      className="w-full max-w-6xl flex justify-end my-4 text-black dark:text-white">
      <Dropdown>
        <DropdownTrigger>
          <Button className="mx-4 focus:outline-none inline-flex"
                  variant="light">
            <p className="font-bold">{selectedKeys}</p>
            <TuneTwoToneIcon className="w-7 h-7"/>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Single selection example"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <DropdownSection title="Sort by"
                           className="text-black dark:text-white">
            {sortOption.map((item) => (
              <DropdownItem key={item.key}>{item.value}</DropdownItem>
            ))}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}