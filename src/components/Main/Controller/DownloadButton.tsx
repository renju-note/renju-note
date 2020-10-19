import {
  Box, ButtonProps, IconButton
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { FiDownload } from 'react-icons/fi'
import { AppStateContext } from '../../appState'
import BoardComponent from '../../BoardComponent'
import { System, SystemContext } from '../../system'

type DefaultProps = {
  buttonSize: ButtonProps['size']
}

const SHARE_BOARD_ID = 'share-board'

const Default: FC<DefaultProps> = ({
  buttonSize,
}) => {
  const appState = useContext(AppStateContext)[0]
  return <>
    <IconButton
      icon={FiDownload} aria-label="share"
      onClick={downloadImage}
      size={buttonSize}
      variant="ghost"
    />
    <Box hidden>
      <SystemContext.Provider value={new System(640)}>
        <BoardComponent
          id={SHARE_BOARD_ID}
          board={appState.board}
          moves={appState.moves}
        />
      </SystemContext.Provider>
    </Box>
  </>
}

const downloadImage = () => {
  const svgElem = document.getElementById(SHARE_BOARD_ID)! as unknown as SVGSVGElement
  const svgData = new XMLSerializer().serializeToString(svgElem)
  const imageElem = new Image()
  imageElem.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  const canvasElem = document.createElement('canvas')
  canvasElem.width = svgElem.width.baseVal.value
  canvasElem.height = svgElem.height.baseVal.value
  const ctx = canvasElem.getContext('2d')!
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvasElem.width, canvasElem.height)
  imageElem.onload = () => {
    ctx.drawImage(imageElem, 0, 0)
    const a = document.createElement('a') as HTMLAnchorElement
    a.href = canvasElem.toDataURL('image/png')
    a.setAttribute('download', 'renju-note.png')
    a.dispatchEvent(new MouseEvent('click'))
  }
}

export default Default
