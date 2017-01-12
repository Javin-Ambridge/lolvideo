import Ember from 'ember';

export default Ember.Controller.extend({
	region: {name: 'All Regions'},
	regionR: {name: 'All Regions'},
	ajax: Ember.inject.service(),
	bigVID: null,
	regions: [{
		name: 'All Regions',
		disabled: true
	}, {
		name: 'NA',
		disabled: false
	}, {
		name: 'EU',
		disabled: false
	}],
	regionsR: [{
		name: 'All Regions',
		disabled: true
	}, {
		name: 'NA',
		disabled: false
	}, {
		name: 'EU',
		disabled: false
	}],
	years: ['2015', '2016'],
	currYear: '2016',
	yearsR: ['2015', '2016'],
	currYearR: '2016',
	bigFilm: null,
	awesome: null,
	fiesta: null,
	newest: null,
	loading: true,
	videoVars: {
	    autoplay: 1,
	    showinfo: 0,
	    enablejsapi: 1,
	    start: 1,
	},
    mostRecentWidth: 0,
    bigFilmWidth: 0,
    awesomeSAndClowWidth: 0,
    mostRecentHeight: 0,
    bigFilmHeight: 0,
    awesomeSAndClowHeight: 0,
    fiestaSortFunc: ['funstompN'],
    awesomeSortFunc: ['awesomeN'],
    queryImplemented: false,
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

		this.set('loading', true);
		this.get('ajax').request('series', {
			method: 'GET'
		}).then(function(response) {
			self.set('bigFilm', {
				id: response.awesome[0].id,
				name: response.awesome[0].name,
				count: response.awesome[0].awesomeN,
				region: response.awesome[0].region,
				loaded: false,
				key: response.awesome[0].key
			});
			response.awesome.shift();
			for(var i = 0; i < response.awesome.length; i++) {
				response.awesome[i].loaded = false;
			}
			for(var j = 0; j < response.funstomp.length; j++) {
				response.funstomp[j].loaded = false;
			}
			for(var k = 0; k < response.newest.length; k++) {
				response.newest[k].loaded = false;
			}

			response.newest.sort(function(a, b) {
				return new Date(b.created_at) - new Date(a.created_at)
			});
			self.set('awesome', response.awesome);
			self.set('fiesta', response.funstomp);
			self.set('newest', response.newest);
			self.set('loading', false);

			Ember.run.later((function() {
				self.resize();
			}), 1000);
		});
	}),
	resize: function() {
		this.updateWidths();
		this.updateHeights();

		var allSizes = [
			'mostRecentWidth',
			'bigFilmWidth',
			'awesomeSAndClowWidth',
			'mostRecentHeight',
			'bigFilmHeight',
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
	},
	updateWidths: function() {
		this.set('mostRecentWidth', $('#recent-container').outerWidth(true));
		this.set('bigFilmWidth', $('#bigfilm-container').outerWidth(true));
		this.set('awesomeSAndClowWidth', $('#awesome-container').outerWidth(true));
	},
	updateHeights: function() {
		this.set('mostRecentHeight', $('#recent-container').outerHeight(true));
		this.set('bigFilmHeight', $('#bigfilm-container').outerHeight(true));
		this.set('awesomeSAndClowHeight', $('#awesome-container').outerHeight(true));
	},
	bigFilmStyle: Ember.computed('bigFilmWidth', 'bigFilmHeight', function() {
		return Ember.String.htmlSafe('width: ' + (this.get('bigFilmWidth') + 10) + 'px; height: ' + (this.get('bigFilmHeight') + 10) + 'px;');
	}),
	normalFilmStyle: Ember.computed('awesomeSAndClowWidth', 'awesomeSAndClowHeight', function() {
		return Ember.String.htmlSafe('width: ' + (this.get('awesomeSAndClowWidth') + 10) + 'px; height: ' + (this.get('awesomeSAndClowHeight') + 10) + 'px;');
	}),
	mediumFilmStyle: Ember.computed('mostRecentWidth', 'mostRecentHeight', function() {
		return Ember.String.htmlSafe('width: ' + (this.get('mostRecentWidth') + 10) + 'px; height: ' + (this.get('mostRecentHeight') + 10) + 'px;');
	}),
	zoomIconBig: Ember.computed('bigFilmWidth', 'bigFilmHeight', function() {
		var width = this.get('bigFilmWidth');
		var height = this.get('bigFilmHeight');
		return this.centerer(width, height, 85, 85);
	}),
	zoomIconSmall: Ember.computed('awesomeSAndClowHeight', 'awesomeSAndClowWidth', function() {
		return this.centerer(this.get('awesomeSAndClowWidth'), this.get('awesomeSAndClowHeight'), 85, 85);
	}),
	zoomIconMed: Ember.computed('mostRecentHeight', 'mostRecentWidth', function() {
		return this.centerer(this.get('mostRecentWidth'), this.get('mostRecentHeight'), 85, 85);
	}),
	centerer: function(w, h, sizeW, sizeH) {
		var topP = (h / 2) - (sizeH / 2);
		var leftP = (w / 2) - (sizeW / 2);
		if (!topP || !leftP || topP < 0 || leftP < 0) {
			return Ember.String.htmlSafe('');
		}
		return Ember.String.htmlSafe('top: ' + topP + 'px; left: ' + leftP + 'px;');
	},
	containerSizeSmall: Ember.computed('awesomeSAndClowHeight', function() {
		return Ember.String.htmlSafe('height: ' + (this.get('awesomeSAndClowHeight') + 100) + 'px;');
	}),
	containerSizeMed: Ember.computed('mostRecentHeight', function() {
		return Ember.String.htmlSafe('height: ' + (this.get('mostRecentHeight') + 100) + 'px;');
	}),

	actions: {
		selectedRegion (val) {
			for(var i = 0; i < this.get('regions').length; i++) {
				if (this.get('regions')[i].name == val.name) {
					var tmp = this.get('regions').objectAt(i);
					Ember.set(tmp, 'disabled', true);
				} else if (this.get('regions')[i].disabled) {
					var tmp = this.get('regions').objectAt(i);
					Ember.set(tmp, 'disabled', false);
				}
			}
			this.set('region', {name: val.name});
		},
		selectedYear (val) {

		},
		loadmore (val) {
			var self = this;
			this.get('ajax').request('loadmore', {
				method: 'GET',
				data: {
					type: val,
					ind: this.get(val).length
				}
			}).then(function(response) {
				var vids = self.get(val);
				for(var i = 0; i < response.additions.length; i++) {
					var tmp = response.additions[i];
					tmp.loaded = false;
					vids.pushObject(tmp);
				}
			});
		},
		bigFilmClick () {
			this.resize();
			this.set('bigFilm.loaded', true);
			this.get('emberYoutube').seekTo(0);
		},
		vidClick (type, ind) {
			var vid = this.get(type).objectAt(ind);
			Ember.set(vid, "loaded", true);
		}
	}
});