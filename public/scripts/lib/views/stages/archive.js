ArchiveView = Backbone.View.extend({
  id : "archive",
  tagName : "div",

  template : $('#tmpl-archive').template('archive'),

  filter : function(story) {
    return story.get('stage_id') === this.model.id;
  },

  initialize : function() {
    var that = this;

    this.storyViews = [];

    this.collection.each(function(story) {
      if (that.filter(story)) {
        that.add(story);
      }
    });

    this.collection.bind('add', function(story, collection) {
      if (this !== collection) return;
      
      if (that.filter(story)) {
        var view = that.add(story, true);
      }
    });

    this.collection.bind('change', function(story, collection) {
      if (that.filter(story)) {
        var view = that.add(story, true);
      } else {
        that.remove(story);
      }
    });

    this.collection.bind('remove', function(story, collection) {
      that.remove(story);
    });
  },

  add : function(story, shouldRender) {
    var view = new ArchiveStoryView({
      model : story,
      tagName : "li"
    });

    this.storyViews.push(view);

    if (shouldRender) {
      if (this.$('#story-' + story.cid).size() == 0) {
         $(view.render().el).hide();
         this.$('.stories').append(view.render().el);
         $(view.el).slideDown()
         this.recalculateSort();
      }
    }

    return view;
  },

  recalculateSort : function() {
    var sortIterator = 0;
    this.$('.story').each(function(index, element) {
      var model = $(element).data('river-model');
      model.set({sort_num : index});
      model.save();
    });
  },

  remove : function(story) {
    this.$('#story-' + story.cid).remove();
  },

  render : function() {
    var that = this;

    this.$('.stories *').remove();

    var storiesEl = this.$('.stories');

    _(this.storyViews).each(function(view) {
      storiesEl.append(view.render().el);
    });
  }
});
