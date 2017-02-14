import DbInterface from './interface'
import Bag from '../foundation/bag'
var MongoClient = require('mongodb')
export default class MongoDb extends DbInterface {
  constructor(url, options = null) {
    super()
    this._url = url
    this._options = options
  }

  open() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this._url, this._options, (err, db) => {
        if (err) {
          reject(err)
        } else {
          resolve(db)
        }
      })
    })
  }
  
  close() {
    return new Promise((resolve, reject) => {
      // We have nothing to do with closing
      resolve()
    })
  }

  find(collection, condition, options = null) {
    return new Promise((resolve, reject) => {
      options = new Bag(options || {})
      this.open().then((db) => {
        let query = db.collection(collection).find(condition)
        if (options.has('skip')) {
          query.skip(options.get('skip'))
        }
        if (options.has('limit')) {
          query.limit(options.get('limit'))
        }
        query.toArray((err, docs) => {
          db.close()
          if (err) {
            reject(err)
          } else {
            resolve(docs)
          }
        })
      }).catch(e => reject(e))
    })
  }

  findOne(collection, condition, options = null) {
    return new Promise((resolve, reject) => {
      this.find(collection, condition, {
        skip: 0,
        limit: 1
      }).then(items => {
        if (items.length === 1) {
          resolve(items[0])
        } else {
          resolve(null)
        }
      }).catch(e => reject(e))
    })
  }

  insert(collection, data, options = null) {
    if (Array.isArray(data)) {
      return this.insertMany(collection, data, options)
    } else {
      return this.insertOne(collection, data, options)
    }
  }

  insertOne(collection, data, options = null) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.collection(collection).insertOne(data, options, (err, result) => {
          db.close()
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      }).catch(e => reject(e))
    })
  }

  insertMany(collection, data, options = null) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.collection(collection).insertMany(data, options, (err, result) => {
          db.close()
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      }).catch(e => reject(e))
    })
  }

  update(collection, condition, data, options = null) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        options = new Bag(options || {})
        if (options.get('multi', true)) {
          db.collection(collection).updateMany(condition, {
            $set: data
          }, options.only(['w', 'multi', 'upsert', 'wtimeout', 'j']), (err, result) => {
            db.close()
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        } else {
          db.collection(collection).updateOne(condition, {
            $set: data
          }, options.only(['w', 'multi', 'upsert', 'wtimeout', 'j', 'bypassDocumentValidation']), (err, result) => {
            db.close()
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        }
      }).catch(e => reject(e))
    })
  }

  delete(collection, condition, options = null) {
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        options = new Bag(options || {})
        if (options.get('multi', true)) {
          db.collection(collection).deleteMany(condition, options.only(['w', 'wtimeout', 'j']), (err, result) => {
            db.close()
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        } else {
          db.collection(collection).deleteOne(condition, options.only(['w', 'wtimeout', 'j']), (err, result) => {
            db.close()
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        }
      }).catch(e => reject(e))
    })
  }
}