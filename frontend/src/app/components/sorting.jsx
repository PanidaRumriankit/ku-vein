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
  const list = [
    {
      key: "earliest",
      value: "Earliest"
    },
    {
      key: "latest",
      value: "Latest"
    },
    {
      key: "upvote",
      value: "Upvote"
    }
  ]
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
            {list.map((item) => (
              <DropdownItem key={item.key}>{item.value}</DropdownItem>
            ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
</div>
)
}