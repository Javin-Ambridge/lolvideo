import Ember from 'ember';

export default Ember.Controller.extend({
	region: 'test',
	color: false,
	init: Ember.observer('init', function() {
		if (localStorage.getItem('bg-color')) {
			this.set('color', JSON.parse(localStorage.getItem('bg-color')).color);
		}
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
			localStorage.setItem('bg-color', JSON.stringify({
				color: this.get('color')
			}));
		}
	}
});