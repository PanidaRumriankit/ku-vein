// A dropdown menu button to set the sorting value
import {
  Dropdown, DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger
} from "@nextui-org/dropdown";
import {Button} from "@nextui-org/button";
import TuneTwoToneIcon from "@mui/icons-material/TuneTwoTone";

export default function Sorting({selectedKeys, setSelectedKeys}) {
  return (
    <div className="w-full max-w-6xl flex justify-end my-4 text-black">
      <Dropdown>
        <DropdownTrigger>
          <Button className="mx-4 focus:outline-none inline-flex text-black"
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
          <DropdownSection title="Sort by" className="text-black">
            <DropdownItem key="earliest">Earliest</DropdownItem>
            <DropdownItem key="latest">Latest</DropdownItem>
            <DropdownItem key="upvote">Upvote</DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}