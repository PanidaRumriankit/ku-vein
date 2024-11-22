"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from "@nextui-org/react";
import {useState} from "react";
import OutlinedFlagTwoToneIcon from '@mui/icons-material/OutlinedFlagTwoTone';


export default function ReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}
              variant="light" isIconOnly>
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
            <Button color="primary" onClick={() => {
              setIsOpen(false)
            }}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
