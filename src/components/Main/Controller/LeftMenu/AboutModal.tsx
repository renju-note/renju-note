import {
  Heading,
  Link,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
} from '@chakra-ui/react'
import React, { FC } from 'react'
import { FiGithub, FiTwitter } from 'react-icons/fi'

type DefaultProps = {
  isOpen: boolean
  onClose: () => void
}

const Default: FC<DefaultProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1">About Renju Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading as="h2" size="sm" mb="1rem">
            Links
          </Heading>
          <List mb="1rem">
            <ListItem>
              <ListIcon as={FiTwitter} />
              <Link href="//twitter.com/renjunotecom" color="teal.500" isExternal>
                @renjunotecom
              </Link>
              &nbsp;-&nbsp;contact
            </ListItem>
            <ListItem>
              <ListIcon as={FiGithub} />
              <Link href="//github.com/renju-note" color="teal.500" isExternal>
                @renju-note
              </Link>
              &nbsp;-&nbsp;source code
            </ListItem>
          </List>
          <Heading as="h2" size="sm" mb="1rem">
            Remarks
          </Heading>
          <UnorderedList>
            <ListItem>Use on your own responsibility.</ListItem>
            <ListItem>
              Some of your activities are sent to third-party analytics services in order to improve
              user experiences.
            </ListItem>
          </UnorderedList>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Default
