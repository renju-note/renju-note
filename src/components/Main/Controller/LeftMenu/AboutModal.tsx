import {
  Heading,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay,
  Link,
  List, ListIcon, ListItem,
} from '@chakra-ui/core'
import React, { FC } from 'react'
import { FiTwitter, FiGithub } from 'react-icons/fi'

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
        <ModalHeader as="h1">About Renju Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading as="h2" size="sm" mb="1rem">Links</Heading>
          <List mb="1rem">
            <ListItem>
              <ListIcon icon={FiTwitter} />
              <Link href="//twitter.com/renjunotecom" color="teal.500" isExternal>@renjunotecom</Link>
              &nbsp;-&nbsp;contact
            </ListItem>
            <ListItem>
              <ListIcon icon={FiGithub} />
              <Link href="//github.com/renju-note" color="teal.500" isExternal>@renju-note</Link>
              &nbsp;-&nbsp;source code
            </ListItem>
          </List>
          <Heading as="h2" size="sm" mb="1rem">Remarks</Heading>
          <List styleType="disc">
            <ListItem>
              Use on your own responsibility.
            </ListItem>
            <ListItem>
              Some of your activities are sent to third-party analytics services in order to improve user experiences.
            </ListItem>
          </List>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Default