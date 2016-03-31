'use strict';
global.__base = '../';

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
}); //Close describe Controller
