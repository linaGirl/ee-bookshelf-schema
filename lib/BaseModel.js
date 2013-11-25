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

			return this.model;
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
							return this.hasOne(schema[key], item.hasOne);
						};
					}
					else if (item.belongsToMany){
						proto[key] = function(){
							return this.belongsToMany(schema[key], item.belongsToMany.table, item.belongsToMany.key, item.belongsToMany.otherKey);
						};
					}
					else if (item.hasMany){
						proto[key] = function(){
							return this.hasMany(schema[key], item.hasMany);
						};
					}
					else if (item.belongsTo){
						proto[key] = function(){
							return this.belongsTo(schema[key], item.belongsTo);
						};
					}
				}
			});
		}
	});
}();