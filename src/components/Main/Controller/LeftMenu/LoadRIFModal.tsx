import {
  Heading,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay,
  Link,
  List, ListItem,
  Input, Button,
  Flex,
  Progress,
  Stack,
  useDisclosure,
} from '@chakra-ui/core'
import React, { FC, useState } from 'react'
import { RIFDatabase, AnalyzedDatabase } from '../../../../database'

type DefaultProps = {
  isOpen: boolean
  onClose: () => void
}

const Default: FC<DefaultProps> = ({
  isOpen,
  onClose,
}) => {
  const analyzingDisclosure = useDisclosure()
  const [fileIsInvalid, setFileIsInvalid] = useState<boolean>(false)
  const [parsingProgress, setParsingProgress] = useState<number>(0)
  const [analyzingProgress, setAnalyzingProgress] = useState<number>(0)
  const [completed, setCompleted] = useState<boolean>(false)

  const onLoadFile = async () => {
    const elem = document.getElementById('rif-file') as HTMLInputElement
    const files = elem?.files
    if (files === null || files.length === 0) {
      setFileIsInvalid(true)
      return
    }

    onClose()
    analyzingDisclosure.onOpen()

    RIFDatabase.reset()
    const rifDB = new RIFDatabase()
    await rifDB.loadFromFile(files[0], (p) => setParsingProgress(p))

    AnalyzedDatabase.reset()
    const analyzedDB = new AnalyzedDatabase()
    await analyzedDB.loadFromRIFDatabase((p) => setAnalyzingProgress(p))

    setCompleted(true)
  }
  return <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1">Load RIF file</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems="center" mb="1rem">
            <Input
              id="rif-file"
              type="file"
              isInvalid={fileIsInvalid}
              onChange={() => setFileIsInvalid(false)}
              mr="1rem"
            />
            <Button onClick={onLoadFile}>Load</Button>
          </Flex>
          <Heading as="h2" size="sm" mb="1rem">Remarks</Heading>
          <List styleType="disc">
            <ListItem>
              The file can be downloaded from <Link href="http://www.renju.net/downloads/games.php" color="teal.500" isExternal>RenjuNet</Link>. Be sure to follow the rules presented on the site.
            </ListItem>
            <ListItem>
              The data will be stored only in your browser&apos;s storage and <b>never</b> uploaded to anywhere.
            </ListItem>
            <ListItem>
              Keep in mind that, once your browser&apos;s storage was cleared by some actions including deleting histories,
              your loaded data will be also deleted as well.
            </ListItem>
          </List>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>

    <Modal
      isOpen={analyzingDisclosure.isOpen}
      onClose={analyzingDisclosure.onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1">
          { completed ? 'Completed!' : 'Loading...'}
        </ModalHeader>
        <ModalBody>
          <Stack spacing="1rem">
            <Heading as="h2" size="sm" mb="1rem">Parsing content...</Heading>
            <Progress value={parsingProgress} />
            <Heading as="h2" size="sm" mb="1rem">Analyzing games...</Heading>
            <Progress value={analyzingProgress} />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={analyzingDisclosure.onClose} isDisabled={!completed}>OK</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
}

export default Default
