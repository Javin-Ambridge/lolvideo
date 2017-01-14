import ResetScroll from '../mixins/reset-scroll/';
export default Ember.Route.extend(ResetScroll, {
  //I need to do other things with activate
  activate: function() {
    this._super.apply(this, arguments); // Call super at the beginning
    // Your stuff
  }
});