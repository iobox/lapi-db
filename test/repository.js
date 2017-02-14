import MongoDb from '../../src/db/mongo'
import Model from '../../src/db/model'
import Repository from '../../src/db/repository'
import Schema from '../../src/db/schema'
import Container from '../../src/di/container'
import InvalidArgumentException from '../../src/exception/invalid-argument'
var expect = require('chai').expect

/** @test {Repository} */
describe('db/repository.js', () => {
  describe.skip('requires mongodb at localhost:27017', () => {
    let db = null, collection = 'users', container = null, myRepo = null
    const schema = new Schema({
      '_id': {key: true, type: 'string'},
      name: {type: 'string'},
      age: {type: 'int'}
    })
    class MyModel extends Model {
      static getRepository() {
        return MyRepository
      }
      static getSchema() {
        return schema
      }
      static getName() {
        return collection
      }
    }
    class MyRepository extends Repository {
      static getModel() {
        return MyModel
      }
    }

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
      container = new Container()
      container.set('db', db)
      myRepo = new MyRepository(container)
    })

    /** @test {MongoDb#find} */
    describe('#insert', () => {
      it('should throw an exception when model is not an object', () => {
        myRepo.insert('a string')
          .catch(e => {
            expect(e).to.be.an.instanceof(InvalidArgumentException)
          })
      })
      it('should allow to insert multiple objects to database', () => {
        return myRepo.insert([
          {name: 'Bobby', age: 81, gender: 1},
          {name: 'Andy', age: 33}
        ])
          .then((results) => {
            expect(results).to.have.length(2)
            expect(results[0]).to.be.an.instanceof(MyModel)
            expect(results[0].get('name')).to.equal('Bobby')
          })
      })
      it('should allow to insert an object to database', () => {
        return myRepo.insert({name: 'Bobby', age: 81, gender: 1})
          .then((results) => {
            expect(results).to.be.an.instanceof(MyModel)
            expect(results.get('name')).to.equal('Bobby')
          })
      })
    })
  })
})