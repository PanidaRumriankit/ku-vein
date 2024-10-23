import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Button
} from "@nextui-org/react";
import {useState} from "react";
import OutlinedFlagTwoToneIcon from '@mui/icons-material/OutlinedFlagTwoTone';


export default function ReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}
              variant="light">
        <OutlinedFlagTwoToneIcon/>
      </Button>
      <Modal size="sm" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent className="bg-gray-700">
          <ModalHeader className="text-green-500">Report</ModalHeader>
          <ModalBody>
            <form>
              <Textarea placeholder="เหตุผลในการรายงาน" autoFocus minRows={5}/>
              {/* Add more form fields as needed */}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {/* Handle form submission */
            }}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}