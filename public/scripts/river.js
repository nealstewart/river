var backlog;
var currentIteration;
var inProgress;
var underReview;
var archive;

(function() {
var stories = new StoryList;
stories.fetch();

var stageList = new StageList;
stageList.fetch();

backlog = stageList.findOrCreateByAttribute('name', 'backlog');
currentIteration = stageList.findOrCreateByAttribute('name', 'current');
inProgress = stageList.findOrCreateByAttribute('name', 'in progress');
underReview = stageList.findOrCreateByAttribute('name', 'review');
archive = stageList.findOrCreateByAttribute("name", "archive");

var tc = new StoryCreator({ 
  model: backlog,
  collection: stories,
  el : $('#story_creator') 
});

var backlogView = new StageView({
  model: backlog,
  collection: stories,
  el: $('#backlog')
});
backlogView.render();

var currentView = new StageView({
  model: current,
  collection: stories,
  el: $('#current')
});
currentView.render();

var inProgressView = new StageView({
  model: inProgress,
  collection: stories,
  el: $('#in_progress')
});
inProgressView.render();

var reviewView = new StageView({
  model: underReview,
  collection: stories,
  el: $('#review')
});
reviewView.render();

})();
