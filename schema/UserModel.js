!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, BaseModel 	= require('../').BaseModel;



	module.exports = new Class({ 
		inherits: BaseModel

		, name: 'user'
		, collection: 'users'


		, session: {
			hasMany: 'id_user'
		}


		, role: {
			belongsToMany: {
				  table: 	'user_role'
				, key: 		'id_user'
				, otherKey: 'id_role'
			}
		}
	});
}();