import Bag from '../foundation/bag'
import InvalidArgumentException from '../exception/invalid-argument'

export default class Schema extends Bag {
  constructor(data) {
    super()
    this.extend(data)
  }

  /**
   * Set key-value
   * @override
   * @param {!string} key
   * @param {?*} value
   */
  set(key, value) {
    if (key === Schema.FUNC_GET || key === Schema.FUNC_SET) {
      value = new Bag(value)
    }
    super.set(key, value)
  }

  $get(key, value) {
    if (this.has(key)) {
      if (this.has(Schema.FUNC_GET)) {
        const getter = this.get(Schema.FUNC_GET)
        if (getter.has(key)) {
          value = getter.get(key)(value)
        }
      } else {
        const type = this.get(key)
        switch (type) {
          case Schema.TYPE_INT:
            value = Number.parseInt(value)
            break
          case Schema.TYPE_FLOAT:
            value = Number.parseFloat(value)
            break
          default:
            break
        }
      }
    }
    return value
  }
}
Schema.KEY           = 'key'
Schema.REF           = 'ref'
Schema.FUNC_SET      = '$set'
Schema.FUNC_GET      = '$get'
Schema.TYPE          = 'type'
Schema.TYPE_STRING   = 'string'
Schema.TYPE_INT      = 'integer'
Schema.TYPE_FLOAT    = 'float'
Schema.TYPE_BUFFER   = 'buffer'
Schema.TYPE_ARRAY    = 'array'
Schema.TYPE_DATE     = 'date'
Schema.TYPE_DATETIME = 'datetime'