(function() {

  Application.initialize();

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

})();
