import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('dashboard', { path: '/'});
  this.route('awesome', { path: '/awesome'});
  this.route('fun', { path: '/fun'});
  this.route('newest', { path: '/new' });
});

export default Router;