import Ember from 'ember';
var youtubeThumbnailConv, converter;

converter = function(params) {
	return 'http://img.youtube.com/vi/' + params[0] + '/hqdefault.jpg';
};

youtubeThumbnailConv = Ember.Helper.helper(converter);

export { converter };

export default youtubeThumbnailConv;