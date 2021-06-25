import { Button, ButtonGroup } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import { BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { confirmationState } = useContext(BoardStateContext)
  if (confirmationState === undefined) {
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
        colorScheme={confirmationState.ok.colorScheme}
        onClick={confirmationState.ok.onClick}
      >
        {confirmationState.ok.text}
      </Button>
      <Button
        width="25%"
        colorScheme={confirmationState.cancel.colorScheme}
        onClick={confirmationState.cancel.onClick}
      >
        {confirmationState.cancel.text}
      </Button>
    </ButtonGroup>
  )
}

export default Default
