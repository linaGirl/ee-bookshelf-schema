# ee-bookshelf-schema

simple schema definitoion for bookshelf.js

## installation

	npm install 

you may need to install the libpq-dev library

	sudo apt-get install libpq-dev


## usage

For the detailed usage see the [bookshelf](http://bookshelfjs.org/) & [knex](http://knexjs.org/) docs

### 

	!function(){

		var   Class 		= require('ee-class')
			, log 			= require('ee-log')
			, BaseModel 	= require('ee-bookshelf-schema').BaseModel;



		module.exports = new Class({ 
			inherits: BaseModel

			// the name of your table
			, name: 'user'

			// the name of the id on this table if other than «id»
			, idAttribute: 'id'

			// the name of the collection
			, collection: 'users'

			// mapping
			, role: {
				belongsToMany: {
					  table: 	'user_role'
					, key: 		'id_user'
					, otherKey: 'id_role'
				}
			}

			// has many, the string is the fk in the other table
			, session: {
				hasMany: 'id_user'
			}

			// has one, the string is the fk in the other table
			, profile: {
				hasOne: 'id_user'
			}

			// belongs to, the string is the fk in this table
			, organization: {
				belongsTo: 'id_organization'
			}
		});
	}();



### Schema
	
	var Schema = require('ee-bookshelf-schema');


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


	// colelctions can be found on the colelction object
	// schema.collection


## CHANGELOG

- 0.1.0: initial release
- 0.1.1: added tests
- 0.1.2: added corerct collection initialization (@huliseerow)