var Story = Backbone.Model.extend({});

var StoryList = Backbone.Collection.extend({
  model : Story,
  localStorage : new Store('river-stories') ,
  comparator : function(story) {
    return story.get('sort_num');
  }
});
