'use strict';
global.__base = __dirname + '/../server/';

var mongoose = require( 'mongoose' );
var expect = require('chai').expect;
var Controller = require(__base + 'controller/poiController');
var poiController = new Controller();

// Build the connection string. Use a test database.
var dbURI = 'mongodb://localhost/xy-inc-test';
describe("poiController", function() {

    before(function() {
      // runs before all tests in this block
      mongoose.connect(dbURI);
    });

    after(function() {
      //Drop the test database
      mongoose.connection.db.dropDatabase(function(err) {
        if (err) throw new Error(err);
      });
    });

  var obj = {nome: "UniqueNameForTestPurpouse", x: 8989898, y: 45685985};
  var randomId = '56fc7a0cbb59cfc84fa06ff1';
  var exampleArray = [
    {nome: 'Lanchonete', x: 27, y: 12},
    {nome: 'Posto', x: 31, y: 18},
    {nome: 'Joalheria', x: 15, y: 12},
    {nome: 'Floricultura', x: 19, y: 21},
    {nome: 'Pub', x: 12, y: 8},
    {nome: 'Supermercado', x: 23, y: 6},
    {nome: 'Churrascaria', x: 28, y: 2}
  ];

  describe("#save", function() {
     it('Should successfully insert and POI object into data base', function(done) {
       poiController.save(obj, function(err, result) {
         if (err) throw new Error(err.message);
         expect(result.code).to.be.equal(200);
         done();
       });
     });

     it('Should successfully insert 7 object into data base', function(done) {
       //In the future, the API might suport a bulk creation. Unfortunelly mongoose doesn't support yet
       var count = 0;
       exampleArray.forEach(function(element) {
        poiController.save(element, function(err, result) {
          if (err) throw new Error(err.message);
          expect(result.code).to.be.equal(200);

          if(++count >= exampleArray.length) //Execute 'done', only after all callbacks are returned
           done();
        });
       });
     });

     it('Should not allow save the same object again', function(done) {
       //The fields x and y are unique, so only one POI in the data base can have the same coordinates
       poiController.save(obj, function(err) {
         var expectErrObj = {code: 400, message: 'Coordinates already into database'};
         expect(err).to.be.deep.equal(expectErrObj);
         done();
       });
     });

     it('Should not allow save an object missing required fields', function(done) {
       // All field for a POI object are required, so an object without any field cannot be persisted
       poiController.save({x: 1, y: 2}, function(err) {
         var expectErrObj = {code: 400, message: 'Error: ValidationError: Path `nome` is required.'};
         expect(err).to.be.deep.equal(expectErrObj);
         done();
       });
     });
  }); //Close describe for save

  describe("#retrieve", function() {
    it('Should return error for missing parameter x', function(done) {
      poiController.getAll({x: 1}, function(err) {
        expect(err).not.to.be.null;
        expect(err.code).to.be.equal(400);
        done();
      });
    });

    it('Should return error for missing parameter y', function(done) {
      poiController.getAll({y: 2}, function(err) {
        expect(err).not.to.be.null;
        expect(err.code).to.be.equal(400);
        done();
      });
    });

    it('Should get all names for points of interest', function(done) {
      poiController.getAll({x: 20, y: 10, dmax: 10}, function(err, result) {
        if (err) throw new Error(err.message);
        var arr = result.message;
        expect(arr).to.have.length.of.at.least(4);
        done();
      });
    });

    it('Should get an array of objects from the database', function(done) {
      poiController.getAll({}, function(err, result) {
        if (err) throw new Error(err.message);
        var arr = result.message;
        expect(arr).to.have.length.of.at.least(1);
        done();
      });
    });

    it('Should get one object by its name', function(done) {
      poiController.getAll({q: {nome: obj.nome}}, function(err, result) {
        if (err) throw new Error(err.message);
        var arr = result.message;
        expect(arr).to.have.length.of.at.least(1);
        expect(arr[0].nome).to.be.equal(obj.nome);
        obj._id = arr[0]._id; //get the current ID to use later
        done();
      });
    });

    it('Should get one object by its ID', function(done) {
        poiController.getOne(obj._id, function(err, result) {
          if (err) throw new Error(err.message);
          expect(result.message.nome).to.be.equal(obj.nome);
          done();
        });
    });

    it('Should not found the object', function(done) {
      poiController.getOne(randomId, function(err) {
        expect(err).not.to.be.null;
        expect(err.code).to.be.equal(404);
        done();
      });
    });
  }); //Closse describe for retrieve

  describe("#updates", function() {
      it('Should successfully update an existing object', function(done) {
        obj.x = 8989898; obj.y = 45685986;
        poiController.update(obj._id, obj, function(err, result) {
          if (err) throw new Error(err.message);
          expect(result.code).to.be.equal(200);
          done();
        });
      });

      it('Should not found the object', function(done) {
        poiController.update(randomId, obj, function(err) {
          expect(err).not.to.be.null;
          expect(err.message).to.be.equal('ID Not Found');
          done();
        });
      });

      it('Should not allow update for coordinates already in data base', function(done) {
        poiController.update(obj._id, {nome: obj.nome, x: 27, y: 12}, function(err, result) {
          expect(err).not.to.be.null;
          expect(err.code).to.be.equal(400);
          done();
        });
      });
  }); //Close describe for updates

  describe("#removes", function() {
    it('Should successfully removes the object', function(done) {
      poiController.remove(obj._id, function(err, result) {
        if (err) throw new Error(err.message);
        expect(result.code).to.be.equal(200);
        done();
      });
    });

    it('Should not found the object', function(done) {
      poiController.remove(randomId, function(err) {
        expect(err).not.to.be.null;
        expect(err.message).to.be.equal('ID Not Found');
        done();
      });
    });
  }); //Close descrive for removes
}); //Close describe Controller
