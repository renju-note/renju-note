import React, { FC } from 'react'
import { Input, Button } from '@chakra-ui/core'
import { RIFDatabase } from '../../database'

const Default: FC = () => {
  const onOpen = async () => {
    const elem = document.getElementById('rif-file') as HTMLInputElement
    const files = elem?.files
    if (files === null || files.length === 0) {
      console.log('No file')
      return
    }

    RIFDatabase.reset()
    const db = new RIFDatabase()
    await db.loadFromFile(files[0])
  }
  return <>
    <Input id="rif-file" type="file" />
    <Button onClick={onOpen}>open</Button>
  </>
}

export default Default
