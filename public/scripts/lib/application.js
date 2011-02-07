Application = {};

Application.namespace = function(namespaceToCreate) {
  var namespaces = namespaceToCreate.split(".");
  var currentPointInNamespaces = window;

  for(var i = 0, length = namespaces.length; i < length; i++) {
    if (!currentPointInNamespaces[namespaces[i]]) {
      currentPointInNamespaces[namespaces[i]] = {};
    }

    currentPointInNamespaces = currentPointInNamespaces[namespaces[i]];
  }
};

Application.Controller = Backbone.Controller.extend({
  routes : {
    "archive" : "archive",
    "completed" : "completed",
    "" : "main"
  },

  main : function() {
    if (this._archiveView || this._completedView) {
      $('.overlaying_page').addClass("hidden");
    }

    if (!this._loadedMainPage) {
      var tc = new StoryCreator({ 
        model: Application.Backlog,
        collection: Application.Stories,
        el : $('#story_creator') 
      });

      var backlogView = new StageView({
        model: Application.Backlog,
        collection: Application.Stories,
        el: $('#backlog')
      });
      backlogView.render();

      var currentView = new StageView({
        model: Application.CurrentIteration,
        collection: Application.Stories,
        el: $('#current')
      });
      currentView.render();

      var inProgressView = new StageView({
        model: Application.InProgress,
        collection: Application.Stories,
        el: $('#in_progress')
      });
      inProgressView.render();

      var reviewView = new StageView({
        model: Application.UnderReview,
        collection: Application.Stories,
        el: $('#review')
      });
      reviewView.render();

      this._loadedMainPage = true;
    }
  },

  archive : function() {
    if (!this._archiveView) {
      this._archiveView = new ArchiveView({
        model: Application.Archive,
        collection : Application.Stories,
        el : $('#archive')
      });

      this._archiveView.render();
    }

    $(this._archiveView.el).removeClass('hidden');

    /*
      render the archive.
      make it display on top of the current screen.
    */
  },

  completed : function() {
    if (!this._completedView) {
      this._completedView = new CompletedView({
        model: Application.Complete,
        collection : Application.Stories,
        el : $('#completed')
      });

      this._completedView.render();
    }

    $(this._completedView.el).removeClass('hidden');

    /*
      render the archive.
      make it display on top of the current screen.
    */
  }
});

Application.initializeCollections = function() {
  this.Stories = new StoryList;
  this.Stories.fetch();

  this.Stages = new StageList;
  this.Stages.fetch();

  this.Iterations = new IterationList;
  this.Iterations.fetch();
};

Application.initializeStages = function() {
  this.Archive = this.Stages.findOrCreateByAttribute("name", "archive");
  this.Backlog = this.Stages.findOrCreateByAttribute("name", "backlog");
  this.CurrentIteration = this.Stages.findOrCreateByAttribute("name", "current");
  this.InProgress = this.Stages.findOrCreateByAttribute("name", "in progress");
  this.UnderReview = this.Stages.findOrCreateByAttribute("name", "review");
  this.Complete = this.Stages.findOrCreateByAttribute("name", "complete");

  this.Archive.set({ next_stage_id : this.Backlog.id });
  this.Archive.save();

  this.Backlog.set({ next_stage_id : this.CurrentIteration.id });
  this.Backlog.save();

  this.CurrentIteration.set({ next_stage_id : this.InProgress.id });
  this.CurrentIteration.save();

  this.InProgress.set({ next_stage_id : this.UnderReview.id });
  this.InProgress.save();

  this.UnderReview.set({ next_stage_id : this.Complete.id });
  this.UnderReview.save();
};

Application.initializeGlobalViews = function() {
  this.iterationCompleter = new IterationCompleter({
    el : $('#iteration_completer')
  });
};

Application.hacksForDisplaying = function() {
  var resizingFunction = function() {
    var tb = $('#main_table');
    var heightToSet = $(window).height() - ($('header#main').height() + $('#headers').height());
    var offset = 28;
    tb.height(heightToSet - offset);
    var tableContainer = tb.parent();
    console.log(tableContainer);
    tableContainer.height(heightToSet - offset);
  };

  resizingFunction();
  $(window).bind('resize', resizingFunction);
}

Application.initialize = function() {
  this.initializeCollections();
  this.initializeStages();
  this.initializeGlobalViews();
  this.hacksForDisplaying();

  new Application.Controller;
  Backbone.history.start();
};
