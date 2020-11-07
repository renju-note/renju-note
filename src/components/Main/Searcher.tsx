import React, { FC, useContext, useState } from 'react'
import { Input, Button, Flex, Stack } from '@chakra-ui/core'
import { RIFDatabase, AnalyzedDatabase, Game as RIFGame } from '../../database'
import { AppStateContext } from '../contexts'

const Default: FC = () => {
  const appState = useContext(AppStateContext)[0]
  const [games, setGames] = useState<RIFGame[]>([])
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
  const onIndex = async () => {
    AnalyzedDatabase.reset()
    const analyzed = new AnalyzedDatabase()
    await analyzed.loadFromRIFDatabase()
  }
  const onSearch = async () => {
    const analyzed = new AnalyzedDatabase()
    const db = new RIFDatabase()
    const ids = await analyzed.search([appState.blacks, appState.whites], 10, 0)
    const games = await db.games.bulkGet(ids)
    setGames(games)
  }
  return <Stack>
    <Flex>
      <Input id="rif-file" type="file" />
      <Button onClick={onOpen}>open</Button>
    </Flex>
    <Flex>
      <Button onClick={onIndex}>index</Button>
    </Flex>
    <Flex>
      <Button onClick={onSearch}>search</Button>
    </Flex>
    <Flex>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Black</th>
            <th>White</th>
            <th>Result</th>
            <th>Moves</th>
          </tr>
        </thead>
        <tbody>
          {
            games.map((g, key) => {
              return <tr key={key}>
                <td>{g.id}</td>
                <td>{g.black}</td>
                <td>{g.white}</td>
                <td>{g.bresult}</td>
                <td>{g.move}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    </Flex>
  </Stack>
}

export default Default
