export class ConfirmOption {
  readonly text: string = ''
  readonly colorScheme?: string
  readonly onClick?: () => void

  constructor(init?: undefined | Partial<ConfirmOption>) {
    if (init !== undefined) Object.assign(this, init)
  }
}

export class ConfirmState {
  readonly ok: ConfirmOption = new ConfirmOption()
  readonly cancel: ConfirmOption = new ConfirmOption()

  constructor(init?: undefined | Partial<ConfirmState>) {
    if (init !== undefined) Object.assign(this, init)
  }
}
