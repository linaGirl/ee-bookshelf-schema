!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, EventEmitter 	= require('ee-event-emitter');



	module.exports = new Class({
		inherits: EventEmitter

		/**
		 * class contructor
		 *
		 * @param <Object> options
		 */
		, init: function(options) {
			this.db 	= options.db;
			this.schema = options.schema;

			this.initialize();

			this.model.intializeRelations = this.intializeRelations.bind(this);
			this.model.collectionName = this.collection;
			this.model.getDefinition = this.getDefinition.bind(this);

			return this.model;
		}


		
		/**
		 * the getDefinition() method returns the model definition
		 */
		, getDefinition: function(){
			var   relations = {};

			Object.keys(this).forEach(function(key){
				if (this[key].hasOne || this[key].hasMany || this[key].belongsTo || this[key].belongsToMany){
					var definition = this[key];

					if (definition.hasOne){
						definition = definition.hasOne;
						relations[key] = {
							  type 				: 'hasOne'
							, targetModel 		: definition.model || key
							, targetKey 		: definition
							, key 				: this.idAttribute || 'id'
						};
					}
					else if (definition.belongsToMany){
						definition = definition.belongsToMany;
						relations[key] = {
							  type 				: 'belongsToMany'
							, mappingModel 		: definition.table
							, ourMappingKey	 	: definition.key
							, targetMappingKey  : definition.otherKey
							, targetModel	  	: definition.model || key
							, targetKey 		: this.schema[definition.model || key].idAttribute || 'id'
							, key 				: this.idAttribute || 'id'
						};
					}
					else if (definition.hasMany){
						definition = definition.hasMany;

						relations[key] = {
							  type 				: 'hasMany'
							, targetModel 		: definition.model || key
							, targetKey 		: definition
							, key 				: this.idAttribute || 'id'
						};
					}
					else if (definition.belongsTo){
						definition = definition.belongsTo;
						relations[key] = {
							  type 				: 'belongsTo'
							, targetModel 		: definition.model || key
							, targetKey 		: definition.key
							, key 				: this.idAttribute || 'id'
						};
					}
				}
			}.bind(this));

			return relations;
		}



		/**
		 * the initialize() method creates the model
		 */
		, initialize: function(){
			var options = {};

			if (!this.name) throw new Error('Missing name attribute on table!').setName('MissingAttributeException');

			options.tableName = this.name;
			if (this.idAttribute) options.idAttribute = this.idAttribute;

			this.model = this.db.Model.extend(options);
		}



		/**
		 * the intializeRelations() method creates the relations on the table
		 */
		, intializeRelations: function(){
			var   schema = this.schema
				, self = this
				, proto = new this.model().__proto__;

			Object.keys(this).forEach(function(key){
				if (key !== 'parent'){
					var item = self[key];

					if (item.hasOne){
						proto[key] = function(){
							if (item.hasOne.model) return this.hasOne(schema[item.hasOne.model], item.hasOne.key);
							else return this.hasOne(schema[key], item.hasOne);
						};
					}
					else if (item.belongsToMany){
						proto[key] = function(){
							if (item.belongsToMany.model) return this.belongsToMany(schema[item.belongsToMany.model], item.belongsToMany.table, item.belongsToMany.key, item.belongsToMany.otherKey);
							else return this.belongsToMany(schema[key], item.belongsToMany.table, item.belongsToMany.key, item.belongsToMany.otherKey);
						};
					}
					else if (item.hasMany){
						proto[key] = function(){
							if (item.hasMany.model) return this.hasMany(schema[item.hasMany.model], item.hasMany.key);
							else return this.hasMany(schema[key], item.hasMany);
						};
					}
					else if (item.belongsTo){
						proto[key] = function(){
							if (item.belongsTo.model) return this.belongsTo(schema[item.belongsTo.model], item.belongsTo.key);
							else return this.belongsTo(schema[key], item.belongsTo);
						};
					}
				}
			});
		}
	});
}();