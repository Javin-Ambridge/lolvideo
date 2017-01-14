import Ember from 'ember';

export default Ember.Controller.extend({
	region: 'test',
	color: false,
	specificPage: false,
	newest: false,
	fun: false,
	awesome: false,
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
	currPath: Ember.observer('currentPath', function() {
		var specificPages = ['newest', 'fun', 'awesome'];
		var set = false;
		for(var i = 0; i < specificPages.length; i++) {
			this.set(specificPages[i], false);
			if (this.get('currentPath') == specificPages[i]) {
				this.set('specificPage', true);
				this.set(specificPages[i], true);
				set = true;
			}
		}
		if (!set) {
			this.set('specificPage', false);
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