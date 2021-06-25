import { Button, ButtonGroup } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import { BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { confirmState } = useContext(BoardStateContext)
  if (confirmState === undefined) {
    return <></>
  }
  return (
    <ButtonGroup
      width="100%"
      justifyContent="space-evenly"
      alignItems="center"
      size={system.buttonSize}
    >
      <Button
        width="25%"
        colorScheme={confirmState.ok.colorScheme}
        onClick={confirmState.ok.onClick}
      >
        {confirmState.ok.text}
      </Button>
      <Button
        width="25%"
        colorScheme={confirmState.cancel.colorScheme}
        onClick={confirmState.cancel.onClick}
      >
        {confirmState.cancel.text}
      </Button>
    </ButtonGroup>
  )
}

export default Default
