import Ember from 'ember';
var logicOr, logic;

logic = function(params) {
	for (var i = 0; i < params.length; i++) {
		if (params[i]) {
			return true;
		}
	}
	return false;
};

logicOr = Ember.Helper.helper(logic);

export { logic };

export default logicOr;