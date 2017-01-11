import Ember from 'ember';

export default Ember.Component.extend({
	large: null,
	ajax: Ember.inject.service(),
	medium: null,
	small: null,
	count: 0,
	awesomeOption: false,
	funOption: false,
	badOption: false,
	sendRating: function(params) {
		var self = this;
		this.get('ajax').request('series', {
			method: 'POST',
      		data: {
        		type: params.type,
        		key: params.key
      		}
		}).then(function(response) {
			self.set('voted', true);
			switch (params.type) {
				case 'awesome':
					self.set('count', self.get('count') + 1);
					self.set('awesomeOption', true);
					self.set('badOption', false);
					break;
				case 'boring':
					self.set('count', self.get('count') - 1);
					self.set('awesomeOption', false);
					self.set('badOption', true);
					break;
				case 'fun':
					self.set('count', self.get('count') + 1);
					self.set('funOption', true);
					break;
			}
			Ember.$('.rate-container').blur();
		});
	},


	actions: {
		rate: function(type) {
			switch (type) {
				case 'awesome':
					if (this.get('awesomeOption')) {
						return;
					}
					break;
				case 'boring':
					if (this.get('badOption')) {
						return;
					}
					break;
				case 'fun':
					if (this.get('funOption')) {
						return;
					}
				break;
			}
			this.sendRating({
				type: type,
				key: this.get('idKey')
			});
		}
	}
});