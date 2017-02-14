import Bag from '../foundation/bag'
import Repository from './repository'
import Schema from './schema'

import NotImplementedException from '../exception/not-implemented'
import NotFoundException from '../exception/not-found'
export default class Model extends Bag {
  /**
   * Return identity of Model
   * @abstract
   * @returns {string|number}
   */
  getId() {
    throw new NotImplementedException('[Db/Model#getId] method getId must be implemented')
  }

  /**
   * Table or collection's name
   * @abstract
   * @returns {string}
   */
  static getName() {
    throw new NotImplementedException('[Db/Model.getName] static method getName must be implemented')
  }

  /**
   * Get repository
   * @abstract
   * @returns {Repository}
   */
  static getRepository() {
    throw new NotImplementedException('[Db/Model.getRepository] static method getRepository must be implemented')
  }

  /**
   * Get schema
   * @abstract
   * @returns {Schema}
   */
  static getSchema() {
    throw new NotImplementedException()
  }

  /**
   * Get identity's condition
   * @returns {Object}
   */
  getIdentity() {
    let identity = {}
    this.constructor.getSchema().forEach((field, options) => {
      if (options.has(Schema.KEY) && options.get(Schema.KEY) === true) {
        identity[field] = this.get(field)
      }
    })
    return identity
  }

  /**
   * Get value by key
   * @param {!string} field
   * @param {?*} def
   * @returns {?*}
   */
  get(field, def = null) {
    if (!this.has(field)) {
      return def
    }
    
    const schema = this.constructor.getSchema()
    if (!schema.has(field)) {
      return def
    }

    const options = schema.get(field)
    let value = super.get(field)
    if (options.has(Schema.FUNC_GET)) {
      value = options.get(Schema.FUNC_GET)(value)
    }

    return value
  }

  /**
   * Set value of field
   * @param {!string} field
   * @param {?*} value
   */
  set(field, value) {
    const schema = this.constructor.getSchema()
    if (schema.has(field)) {
      const options = schema.get(field)
      if (options.has(Schema.FUNC_SET)) {
        value = options.get(Schema.FUNC_SET)(value)
      }  else if (options.has(Schema.TYPE)) {
        switch (options.get(Schema.TYPE)) {
          case Schema.TYPE_INT:
            value = parseInt(value)
            break
          case Schema.TYPE_FLOAT:
            value = parseFloat(value)
            break
          case Schema.TYPE_BUFFER:
            break
          case Schema.TYPE_ARRAY:
          case Array:
            if (!Array.isArray(value)) {
              value = [value]
            }
            break
          case Schema.TYPE_DATE:
          case Schema.TYPE_DATETIME:
            if (!(value instanceof Date)) {
              value = new Date(value)
            }
            break
          case Schema.TYPE_STRING:
          case String:
            if (typeof value === 'object' && typeof value['toString'] === 'function') {
              value = value.toString()
            }
            break
          case Schema.TYPE_NUMBER:
          case Number:
            break
          default:
            break
        }
      }
    }
    super.set(field, value)
  }

  toObject() {
    const SCHEMA = this.constructor.getSchema()
    let item = {}
    SCHEMA.forEach((field, options) => {
      item[field] = this.get(field)
    })
    return item
  }

  /**
   * Save model
   * @returns {Promise}
   */
  save() {
    return this.constructor.getRepository().update(this.all(), this.getIdentity())
  }

  /**
   * Remove current model from database
   * @returns {Promise}
   */
  destroy() {
    return this.constructor.getRepository().delete(this.getIdentity())
  }
}