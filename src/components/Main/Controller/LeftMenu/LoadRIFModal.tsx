import {
  Heading,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay,
  Link,
  List, ListItem,
  Input, Button,
  Flex,
} from '@chakra-ui/core'
import React, { FC } from 'react'
import { RIFDatabase, AnalyzedDatabase } from '../../../../database'

type DefaultProps = {
  isOpen: boolean
  onClose: () => void
}

const Default: FC<DefaultProps> = ({
  isOpen,
  onClose,
}) => {
  const onLoadFile = async () => {
    const elem = document.getElementById('rif-file') as HTMLInputElement
    const files = elem?.files
    if (files === null || files.length === 0) {
      console.log('No file')
      return
    }

    RIFDatabase.reset()
    const db = new RIFDatabase()
    await db.loadFromFile(files[0])
    AnalyzedDatabase.reset()
    const analyzed = new AnalyzedDatabase()
    await analyzed.loadFromRIFDatabase()
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1">Load RIF file</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems="center" mb="1rem">
            <Input id="rif-file" type="file" mr="1rem"/>
            <Button onClick={onLoadFile}>Load</Button>
          </Flex>
          <Heading as="h2" size="sm" mb="1rem">Remarks</Heading>
          <List styleType="disc">
            <ListItem>
              The file can be downloaded from <Link href="http://www.renju.net/downloads/games.php" color="teal.500" isExternal>RenjuNet</Link>. Be sure to follow the rules presented on the site.
            </ListItem>
            <ListItem>
              The data will be stored only in your browser&apos;s storage, and <b>never</b> uploaded to anywhere.
            </ListItem>
            <ListItem>
              Keep in mind that, once your browser&apos;s storage was resetted by some actions including deleting histories,
              renju-note&apos;s data will be deleted at the same time.
            </ListItem>
          </List>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Default
