!function(){

	var   Class 		= require('ee-class')
		, EventEmitter	= require('ee-event-emitter')
		, log 			= require('ee-log')
		, orm 			= require('bookshelf')
		, fs 			= require('fs')
		, path 			= require('path')
		, exec 			= require('bookshelf/plugins/exec')
		, BaseModel 	= require('./BaseModel');



	var Schema = module.exports = new Class({
		inherits: EventEmitter


		// reference to all models
		, models: {}

		, collections: {}


		/**
		 * class constructor
		 */
		, init: function(options) {
			if (!options.dialect) throw new Error('ee-bookshelf-schema: missing configuration property «dialect»!').setName('InvalidParameterException');		
			if (!options.host) throw new Error('ee-bookshelf-schema: missing configuration property «host»!').setName('InvalidParameterException');		
			if (!options.user) throw new Error('ee-bookshelf-schema: missing configuration property «user»!').setName('InvalidParameterException');		
			if (!options.password) throw new Error('ee-bookshelf-schema: missing configuration property «password»!').setName('InvalidParameterException');		
			if (!options.database) throw new Error('ee-bookshelf-schema: missing configuration property «database»!').setName('InvalidParameterException');		
			if (!options.models) throw new Error('ee-bookshelf-schema: missing configuration property «models»!').setName('InvalidParameterException');		

			this._config = {
				  client: options.dialect
				, connection: {
					  host 		: options.host
					, user 		: options.user
					, password 	: options.password
					, database 	: options.database
					, port 		: options.port
				}
			};

			// dir whith schema definitions
			this.dir = options.models;


			this._initialize(function(){
				this._loadModels(function(err){
					if (err) {
						this.emit('error', err);
						this.emit('load', err);
						log('failed to load models!', err);
					}
					else {
						this.emit('load');
					}
				}.bind(this));
			}.bind(this));
		}


		/**
		 * the _initialize() method initializes the db and models
		 *
		 * @param <Function> callback
		 */
		, _initialize: function(loaded) {
			this.db = orm.initialize(this._config);
			this.db.plugin(exec);

			this.db.knex.raw('SELECT 1').exec(function(err){
				if (err) {
					this.emit('error', err);
					this.emit('load', err);
					log('failed to connect to database!', err);
				}
				else loaded();
			}.bind(this));
		}



		/**
		 * the _loadModels() method loads all the db models
		 */
		, _loadModels: function(callback) {
			var   options 	= { db: this.db, schema: this.models };

			fs.readdir(this.dir, function(err, files){
				if (err) callback(err);
				else {
					files.forEach(function(fileName){
						var modelName;

						if(fileName.substr(fileName.length - 3) === '.js'){
							modelName = fileName[0].toLowerCase() + fileName.substr(1, fileName.lastIndexOf('Model.js')-1);

							// create model
							this.models[modelName] = new (require(this.dir+'/'+fileName))(options);

							// create collection
							this.collections[this.models[modelName].collectionName] = new this.db.Collection({
								model: this.models[modelName]
							});
						}
					}.bind(this));

					//add relations to the models, bind to this class instance
					Object.keys(this.models).forEach(function(modelName){
						this.models[modelName].intializeRelations();
						this[modelName] = this.models[modelName];
					}.bind(this));

					callback();
				}
			}.bind(this));			
		}
	});


	Schema.BaseModel = BaseModel;
}();