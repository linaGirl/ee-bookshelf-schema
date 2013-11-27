
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, path 			= require('path')
		, assert 		= require('assert')
		, Schema 		= require('../');



	log(process.env);



	describe('The Schema', function(){
		var schema, user;

		it('should emit an «on load» event', function(done){
			schema = new Schema({
				  dialect: 	'postgres'
				, host: 	process.env.DB_HOST
				, port: 	process.env.DB_PORT
				, user: 	'postgres'
				, password: process.env.DB_PASS
				, database: 'wpm'
				, models: 	path.join(__dirname, '../schema')
			});

			schema.on('load', done);
		});	

		it('should be able to insert records', function(done){
			new schema.user({}).save().exec(function(err, usr){
				if (!err) {
					assert.ok(usr);
					user = usr;
				}
				done(err);				
			});
		});

		it('should respond with with matching records', function(done){
			var qb = new schema.user().query();
			qb.where({id: user.id}).select('id').exec(function(err, usr){
				if (!err) {
					assert.ok(usr);
					assert.ok(usr.length === 1);
					assert.deepEqual(JSON.stringify(user), JSON.stringify(usr[0]));
				}
				done(err);	
			});
		});	

		it('should be able to delete records', function(done){
			new schema.user({id: user.id}).fetch().exec(function(err, usr){
				if (!err) {
					assert.ok(usr);
					usr.destroy().exec(done);					
				}
				else done(err);	
			});
		});		
	});



	