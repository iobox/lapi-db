import NotImplementedException from '../exception/not-implemented'
export default class DbInterface {
  /**
   * Open a new connection to database
   * @returns {Promise}
   */
  open() {
    throw new NotImplementedException('[Db/db#open] this method must be implemented')
  }

  /**
   * Close existent connection
   * @returns {Promise}
   */
  close() {
    throw new NotImplementedException('[Db/db#close] this method must be implemented')
  }

  /**
   * Find record(s)
   * @param {string} collection
   * @param {Object} condition
   * @param {Object} [options=null]
   * @returns {Promise}
   */
  find(collection, condition, options = null) {
    throw new NotImplementedException('[Db/db#find] this method must be implemented')
  }

  /**
   * Find one record
   * @param {string} collection
   * @param {Object} condition
   * @param {Object} [options=null]
   * @returns {Promise}
   */
  findOne(collection, condition, options = null) {
    throw new NotImplementedException('[Db/db#findOne] this method must be implemented')
  }

  /**
   * Insert record(s)
   * @param {string} collection
   * @param {Array|Object} data if data is an array, it would be multiple insertion
   * @param {Object} [options=null]
   * @returns {Promise}
   */
  insert(collection, data, options = null) {
    throw new NotImplementedException('[Db/db#insert] this method must be implemented')
  }

  /**
   * Update record(s)
   * @param {string} collection
   * @param {Object} condition Condition to update
   * @param {Object} data Only contains new changes
   * @param {Object} [options=null] Additional configuration for updating
   * @returns {Promise}
   */
  update(collection, condition, data, options = null) {
    throw new NotImplementedException('[Db/db#update] this method must be implemented')
  }

  /**
   * Delete record(s)
   * @param {string} collection
   * @param {Object} condition
   * @param {Object} [options=null]
   * @returns {Promise}
   */
  delete(collection, condition, options = null) {
    throw new NotImplementedException('[Db/db#delete] this method must be implemented')
  }
}