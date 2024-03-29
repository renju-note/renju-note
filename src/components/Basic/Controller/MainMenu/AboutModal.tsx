import {
  Box,
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
  Stack,
  UnorderedList,
} from '@chakra-ui/react'
import { FC } from 'react'
import { FiGithub, FiTwitter } from 'react-icons/fi'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const Default: FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1">About Renju Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Heading as="h2" size="sm">
              Links
            </Heading>
            <List>
              <ListItem>
                <ListIcon as={FiTwitter} />
                <Link href="//twitter.com/yubessy_renju" color="teal.500" isExternal>
                  @yubessy_renju
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
            <Heading as="h2" size="sm">
              Remarks
            </Heading>
            <Box>
              <UnorderedList>
                <ListItem>Use on your own responsibility.</ListItem>
                <ListItem>
                  Some of your activity logs will be sent to third-party analytics services in order
                  to improve user experiences.
                </ListItem>
              </UnorderedList>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Default
