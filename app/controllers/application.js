import Ember from 'ember';

export default Ember.Controller.extend({
	region: 'test',
	color: false,
	init: Ember.observer('init', function() {
		this.set('region', 'ovverrr');
	}),
	swapIcon: Ember.computed('color', function() {
		if (this.get('color')) {
			return 'fa-check-square';
		} else {
			return 'fa-check-square-o';
		}
	}),

	actions: {
		swapColors: function() {
			this.toggleProperty('color');
		}
	}
});