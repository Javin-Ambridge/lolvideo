import Ember from 'ember';

export default Ember.Controller.extend({
	ajax: Ember.inject.service(),
	fun: null,
    awesomeSAndClowWidth: 0,
    awesomeSAndClowHeight: 0,
    containerSize: 0,
	videoVars: {
	    autoplay: 1,
	    showinfo: 0,
	    enablejsapi: 1,
	    start: 1,
	},
	init: Ember.observer('init', function() {
		var self = this;

		Ember.run.next(function() {
			//setting initial youtube video width
			//setting initial youtube video height
			self.resize();
		});

		$(window).bind('resize',  function(){
		  	Ember.run(function(){
		    	self.resize();
		 	});
		});

		this.get('ajax').request('videos', {
			method: 'GET',
			data: {
				type: 'fun'
			}
		}).then(function(response) {
			for(var i = 0; i < response.vids.length; i++) {
				response.vids[i].loaded = false;
			}
			self.set('fun', response.vids);
			Ember.run.next(function() {
				self.resize();
			});
		});
	}),
	resize: function() {
		this.updateWidths();
		this.updateHeights();

		var allSizes = [
			'awesomeSAndClowWidth',
			'awesomeSAndClowHeight'
		];
		for(var i = 0; i < allSizes.length; i++) {
			if (this.get(allSizes[i]) === 0) { //Restarting because of invalid value
				var self = this;
				Ember.run.later((function() {
					console.log('restarting');
					self.resize();
				}), 500);
				break;
			}
		}
		if (this.get('containerSize') === 100) {
			Ember.run.later((function() {
				self.resize();
			}), 500);
		}
	},
	updateWidths: function() {
		this.set('awesomeSAndClowWidth', $('#awesome-container').outerWidth(true));
		this.container_size();
	},
	updateHeights: function() {
		this.set('awesomeSAndClowHeight', $('#awesome-container').outerHeight(true));
		this.container_size();
	},
	normalFilmStyle: Ember.computed('awesomeSAndClowWidth', 'awesomeSAndClowHeight', function() {
		return Ember.String.htmlSafe('width: ' + (this.get('awesomeSAndClowWidth')) + 'px; height: ' + (this.get('awesomeSAndClowHeight') + 10) + 'px;');
	}),
	container_size: function() {
		if (this.get('awesomeSAndClowHeight')) {
			this.set('containerSize', Ember.String.htmlSafe('height: ' + (this.get('awesomeSAndClowHeight') + 100) + 'px;'));
		} else {
			this.set('containerSize', Ember.String.htmlSafe('height: inherit;'));
		}
	},
	zoomIconSmall: Ember.computed('awesomeSAndClowHeight', 'awesomeSAndClowWidth', function() {
		return this.centerer(this.get('awesomeSAndClowWidth'), this.get('awesomeSAndClowHeight'), 85, 85);
	}),
	centerer: function(w, h, sizeW, sizeH) {
		var topP = (h / 2) - (sizeH / 2);
		var leftP = (w / 2) - (sizeW / 2);
		if (!topP || !leftP || topP < 0 || leftP < 0) {
			return Ember.String.htmlSafe('');
		}
		return Ember.String.htmlSafe('top: ' + topP + 'px; left: ' + leftP + 'px;');
	},

	actions: {
		vidClick (type, ind) {
			var vid = this.get(type).objectAt(ind);
			Ember.set(vid, "loaded", true);
		},
		loadmore () {
			var self = this;
			this.get('ajax').request('loadmore', {
				method: 'GET',
				data: {
					type: 'fiesta',
					ind: this.get('fun').length,
					specific: true
				}
			}).then(function(response) {
				var vids = self.get('fun');
				for(var i = 0; i < response.additions.length; i++) {
					var tmp = response.additions[i];
					tmp.loaded = false;
					vids.pushObject(tmp);
				}
			});
		}
	}
});