import MongoDb from '../../../src/db/mongo'
var expect = require('chai').expect

/** @test {MongoDb} */
describe('db/driver/mongo.js', () => {
  describe.skip('requires mongodb at localhost:27017', () => {
    let db = null, collection = 'users'
    beforeEach((done) => {
      db = new MongoDb('mongodb://localhost:27017/test')
      db.delete(collection, {})
        .then(() => {
          let tasks = []
          tasks.push(db.insert(collection, {name: 'John', age: 21}))
          tasks.push(db.insert(collection, {name: 'Marry', age: 18}))
          tasks.push(db.insert(collection, {name: 'Bob', age: 18}))
          tasks.push(db.insert(collection, {name: 'Peter', age: 40}))
          Promise.all(tasks).then(() => {done()})
        })
    })

    after((done) => {
      db.delete(collection, {})
        .then(() => {done()})
    })

    /** @test {MongoDb#open} */
    it('[open] should return a Promise', () => {
      expect(db.open().then((conn) => {conn.close()})).to.be.an.instanceof(Promise)
    })

    /** @test {MongoDb#close} */
    it('[close] should run without Exception', () => {
      return db.close().then(() => {})
    })

    /** @test {MongoDb#find} */
    describe('#find', () => {
      it('should return 4 items in total', () => {
        return db.find(collection, {}).then(results => {
          expect(results).to.have.length(4)
        })
      })
      it('should return only 1 item and name is John', () => {
        return db.find(collection, {name: 'John'}).then(results => {
          expect(results).to.have.length(1)
          expect(results[0]).to.contain({name: 'John'})
        })
      })
      it('should return only 2 items has property age is 18', () => {
        return db.find(collection, {age: 18}).then(results => {
          expect(results).to.have.length(2)
        })
      })
      it('should return only 0 items', () => {
        return db.find(collection, {age: 99}).then(results => {
          expect(results).to.have.length(0)
        })
      })
    })

    /** @test {MongoDb#findOne} */
    describe('#findOne', () => {
      it('should return 1 item matches', () => {
        return db.findOne(collection, {age: 40}).then(results => {
          expect(results).to.contain({name: 'Peter'})
        })
      })
      it('should return null when no items found', () => {
        return db.findOne(collection, {age: 99}).then(results => {
          expect(results).to.be.null
        })
      })
    })

    /** @test {MongoDb#insert} */
    describe('#insert', () => {
      it('should allow to insert an item', (done) => {
        db.insert(collection, {name: 'Carrie', age: 30})
          .then(() => {
            db.find(collection, {}).then(results => {
              expect(results).to.have.length(5)
              done()
            }).catch(done)
          })
      })
      it('should allow to insert multiple items', (done) => {
        db.insert(collection, [{name: 'Carrie', age: 30}, {name: 'Paul', age: 27}])
          .then(() => {
            db.find(collection, {}).then(results => {
              expect(results).to.have.length(6)
              done()
            }).catch(done)
          })
      })
    })

    /** @test {MongoDb#delete} */
    describe('#delete', () => {
      it('should allow to delete multiple items as default', (done) => {
        db.delete(collection, {age: 18})
          .then(() => {
            db.find(collection, {age: 18}).then(results => {
              expect(results).to.have.length(0)
              done()
            }).catch(done)
          })
      })
      it('should allow to delete one item only', (done) => {
        db.delete(collection, {age: 18}, {multi: false})
          .then(() => {
            db.find(collection, {age: 18}).then(results => {
              expect(results).to.have.length(1)
              done()
            }).catch(done)
          })
      })
    })

    /** @test {MongoDb#update} */
    describe('#update', () => {
      it('should allow to update multiple items as default', (done) => {
        db.update(collection, {age: 18}, {age: 20})
          .then(() => {
            db.find(collection, {age: 20}).then(results => {
              expect(results).to.have.length(2)
              done()
            }).catch(done)
          })
      })
      it('should allow to update one item only', (done) => {
        db.update(collection, {age: 18}, {age: 20}, {multi: false})
          .then(() => {
            db.find(collection, {age: 20}).then(results => {
              expect(results).to.have.length(1)
              done()
            }).catch(done)
          })
      })
    })
  })
})