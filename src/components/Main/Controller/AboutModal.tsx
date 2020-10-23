import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/core'
import React, { FC } from 'react'

type DefaultProps = {
  isOpen: boolean
  onClose: () => void
}

const Default: FC<DefaultProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Renju Note</Text>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Default
