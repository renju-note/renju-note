export class ConfirmationOption {
  readonly text: string = ''
  readonly colorScheme?: string
  readonly onClick?: () => void

  constructor(init?: undefined | Partial<ConfirmationOption>) {
    if (init !== undefined) Object.assign(this, init)
  }
}

export class ConfirmationState {
  readonly ok: ConfirmationOption = new ConfirmationOption()
  readonly cancel: ConfirmationOption = new ConfirmationOption()

  constructor(init?: undefined | Partial<ConfirmationState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<ConfirmationState>): ConfirmationState {
    return new ConfirmationState({ ...this, ...fields })
  }

  setOptions(ok: ConfirmationOption, cancel: ConfirmationOption): ConfirmationState {
    return this.update({ ok, cancel })
  }
}
