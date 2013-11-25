


	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var Schema = require('./');



	var schema = new Schema({
		  dialect: 	'postgres'
		, host: 	''
		, port: 	
		, user: 	'postgres'
		, password: ''
		, database: 'wpm'
		, models: 	'./schema'
	});



	schema.on('load', function(){
		new schema.user({id: 11}).fetch().exec(function(err, user){
			log(err, JSON.stringify(user));
		});
	});


	