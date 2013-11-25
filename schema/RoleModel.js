!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, BaseModel 	= require('../').BaseModel;



	module.exports = new Class({ 
		inherits: BaseModel

		, name: 'role'
		, collection: 'roles'


		, user: {
			belongsToMany: {
				  table: 	'user_role'
				, key: 		'id_role'
				, otherKey: 'id_user'
			}
		}
	});
}();