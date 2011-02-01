var StageView = Backbone.View.extend({
  className : 'stage',
  tagName : 'ul',

  filter : function(story) {
    return story.get('stage_id') === this.model.id;
  },

  disableSorting : function() {
    $(this.el).sortable("disable");
  },

  enableSorting : function() {
    $(this.el).sortable("enable");
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

    this.collection.bind('change:stage_id', function(story, collection) {
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

  remove : function(story) {
    this.$('#story-' + story.cid).remove();
  },

  add : function(story, shouldRender) {
    var view = new StoryView({model : story});
    this.storyViews.push(view);

    if (shouldRender) {
      if (this.$('#story-' + story.cid).size() == 0) {
         $(view.render().el).hide();
         $(this.el).prepend(view.render().el);
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

  render : function() {
    var that = this;

    this.$('*').remove();

    _(this.storyViews).each(function(view) {
      $(that.el).append(view.render().el);
    });


    $(this.el).sortable({
      connectWith : ".stage",
      placeholder : 'story-placeholder',
      update : function() {
        that.recalculateSort();
      },

      stop : function(event, ui) {
        ui.item.find('.controls').removeClass('hidden');
      },

      receive : function(event, ui) {
        var model = ui.item.data('river-model');
        model = model.set({'stage_id' : that.model.id });
        model.save();

        ui.item.data('river-model', model);
        that.recalculateSort();
      },

      start : function(event, ui) {
        $(document.activeElement).blur();
        ui.item.find('.controls').addClass('hidden');
      }
    });

    $(this.el).addClass('stage');

    return this;
  }
});
