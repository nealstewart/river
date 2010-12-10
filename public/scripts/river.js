(function(window, document, undefined) {
require(
  {
    baseUrl : "/scripts/"
  },

  [
    'order!/scripts/vendor/underscore.js', 
    'order!/scripts/vendor/backbone.js',
    'order!/scripts/vendor/backbone-localstorage.js'
  ], 
   
function() {
"use strict";

var River,
    Story,
    Stage,
    StoryList,
    StageList,
    StageView,
    StoryView,
    StoryCreatorView,
    TrashView;

var Story = Backbone.Model.extend({});
var Stage = Backbone.Model.extend({});

var StoryList = Backbone.Collection.extend({
  model : Story,
  localStorage : new Store('river-stories') ,
  comparator : function(story) {
    return story.get('sort_num');
  }
});

var StageList = Backbone.Collection.extend({
  model : Stage,
  localStorage : new Store('river-stages'),
  findOrCreateByAttribute : function(attribute, value) {
    var attributesToSet = {},
      stagesWithAttribute,
      stage;

    stagesWithAttribute = this.select(function(stage) {
      return stage.get(attribute) === value;
    });

    if (stagesWithAttribute.length == 0) {
      attributesToSet[attribute] = value; 
      stage = this.create(attributesToSet);
    } else {
      stage = stagesWithAttribute[0];
    }

    return stage;
  }
});

var StoryView = Backbone.View.extend({
  className : 'story',
  tagName : 'li',

  events : {
    "dblclick" : "onDblclick",
    "blur" : "blur",
    "keypress" : "keypress",
  },

  keypress : function(event) {
    if (event.keyCode == 13) {
      $(this.el).blur();

      event.preventDefault();
    }
  },

  blur : function(event) {
    var self = $(this.el);
    self.removeAttr('contenteditable');
    self.parent().sortable('enable');

    var model = self.data('river-model');
    model.set({description : self.text()});
    model.save();
  },

  onDblclick : function(evt) {
    var that = this.el,
        self = $(this.el);

    self.attr('contenteditable', true);
    self.parent().sortable('disable');
    
    self.focus();
  },

  render : function() {
    this.$('*').remove();
    $(this.el).html('');
    $(this.el).text(this.model.get('description'));
    $(this.el).data('river-model', this.model);
    $(this.el).attr('id', "story-" + this.model.cid);

    return this;
  }
});

var StageView = Backbone.View.extend({
  className : 'stage',
  tagName : 'ul',

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
    this.$('li').each(function(index, element) {
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

    $(this.el).delegate('*', 'mousedown', function(evt) {
      if (this !== document.activeElement) {
        $(document.activeElement).blur();
      }

    });

    $(this.el).sortable({
      connectWith : ".stage",
      placeholder : 'story-placeholder',
      update : function() {
        that.recalculateSort();
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
      }
    });

    $(this.el).addClass('stage');

    return this;
  }
});

var TrashView = Backbone.View.extend({
  initialize : function() {
    $(this.el).droppable({
      accept : '.story',
      drop : function(event, ui) {
        var model = ui.draggable.data('river-model');
        model.destroy();
        ui.draggable.remove();
      }
    });
  }
});

var StageChanger = Backbone.View.extend({
  initialize : function() {
    this.storyDropped = _.bind(this.storyDropped, this);

    $(this.el).droppable({
      accept : '.story',
      drop : this.storyDropped
    });
  },

  storyDropped : function(event, ui) {
    console.log(this);
    var model = ui.draggable.data('river-model');
    model.set({stage_id : this.model.id});
    model.save();
    ui.draggable.remove();
  }
});

var StoryCreatorView = Backbone.View.extend({
  events : {
    "submit" : "create",
    "keypress textarea" : "keypress"
  },

  keypress : function(evt) {
    if (evt.keyCode == 13) {
      $(this.el).submit();
      evt.preventDefault();
    }
  },

  create : function(event) {
    var textarea = this.$('textarea'),
        description = textarea.val();

    textarea.val('');

    console.log(this.collection.create({
      description : description,
      sort_num : this.collection.length,
      stage_id : this.model.id
    }));

    event.preventDefault();

    return false;
  }
});

River = {
  initialize : function() {
    this.stories = new StoryList();
    this.stories.fetch();

    this.stages = new StageList();
    this.stages.fetch();

    this.backlog = this.stages.findOrCreateByAttribute('name', 'Backlog');
    this.currentIteration = this.stages.findOrCreateByAttribute('name', 'Current Iteration');
    this.inProgress = this.stages.findOrCreateByAttribute('name', 'In-Progress');
    this.underReview = this.stages.findOrCreateByAttribute('name', 'Under Review');

    this.completed = this.stages.findOrCreateByAttribute('name', 'Completed');
    this.archived = this.stages.findOrCreateByAttribute('name', 'Completed');

    var views = {
      trashView : new TrashView({
        collection : this.stories,
        el : $('#trash')  
      }),

      backlogView : new StageView({
        model : this.backlog,
        collection : this.stories,
        el : $('#backlog')
      }),

      currentIterationView : new StageView({
        model : this.currentIteration,
        collection : this.stories,
        el : $('#current_iteration')
      }),

      inProgressView : new StageView({
        model : this.inProgress,
        collection : this.stories,
        el : $('#in_progress')
      }),

      underReviewView : new StageView({
        model : this.underReview,
        collection : this.stories,
        el : $('#review')
      }),

      storyCreatorView : new StoryCreatorView({
        model : this.backlog,
        collection : this.stories,
        el : $('#story_adder')
      }),

      storyCompleterView : new StageChanger({
        model : this.completed,
        el : $('#completer')
      }),

      archiverView : new StageChanger({
        model : this.archived,
        el : $('#icebox')
      })
    };

    _(views).each(function(view) { view.render() });
  }
};

$(function() {
  River.initialize();
  window.River = River;
});

});

})(this, this.document);
