import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  Text,
  Link,
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
        <ModalHeader>Renju Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            If you find any bugs or problems,
            tell <Link href="https://twitter.com/renjunotecom" color="teal.500" isExternal>@renjunotecom</Link>.
          </Text>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Default
