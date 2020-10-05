export class Preference {
  readonly showIndices: boolean = false
  readonly showOrders: boolean = false
  readonly emphasizeLastMove: boolean = false
  readonly showForbiddens: boolean = false
  readonly showPropertyRows: boolean = false
  readonly showPropertyEyes: boolean = false

  constructor (init: Partial<Preference>) {
    if (init.showIndices !== undefined) this.showIndices = init.showIndices
    if (init.showOrders !== undefined) this.showOrders = init.showOrders
    if (init.emphasizeLastMove !== undefined) this.emphasizeLastMove = init.emphasizeLastMove
    if (init.showForbiddens !== undefined) this.showForbiddens = init.showForbiddens
    if (init.showPropertyRows !== undefined) this.showPropertyRows = init.showPropertyRows
    if (init.showPropertyEyes !== undefined) this.showPropertyEyes = init.showPropertyEyes
  }
}
