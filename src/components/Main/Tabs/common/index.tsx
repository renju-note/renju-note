import { Flex, Icon } from '@chakra-ui/react'
import React, { FC } from 'react'
import { RiCheckboxCircleFill, RiCloseLine, RiSubtractFill } from 'react-icons/ri'

export const WonIcon: FC<{ won: boolean | null }> = ({ won }) => {
  switch (won) {
    case true:
      return (
        <Flex justify="center">
          <Icon as={RiCheckboxCircleFill} boxSize="small" color="green.500" />
        </Flex>
      )
    case false:
      return (
        <Flex justify="center">
          <Icon as={RiCloseLine} boxSize="small" color="gray.500" />
        </Flex>
      )
    case null:
      return (
        <Flex justify="center">
          <Icon as={RiSubtractFill} boxSize="small" color="gray.500" />
        </Flex>
      )
    default:
      return <></>
  }
}
