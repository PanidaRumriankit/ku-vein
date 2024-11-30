// A dropdown menu button to set the user's faculty
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger
} from "@nextui-org/dropdown";
import {Button} from "@nextui-org/button";
import TuneTwoToneIcon from "@mui/icons-material/TuneTwoTone";
import {faculties} from "../constants";

export default function FacultyDropDown({selectedKeys, setSelectedKeys}) {
  return (
    <div
      className="flex justify-end ml-20 mb-4 text-black dark:text-white">
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
          className="max-h-40 overflow-y-auto"
        >
          <DropdownSection title="คณะที่เรียน"
                           className="text-black dark:text-white">
            {
              faculties.map((faculty) => (
                <DropdownItem key={faculty}>{faculty}</DropdownItem>
              ))
            }
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}