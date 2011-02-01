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

Application.initialize = function() {
  this.Stories = new StoryList;
  this.Stories.fetch();
  this.Stages = new StageList;
  this.Stages.fetch();

  this.Backlog = this.Stages.findOrCreateByAttribute('name', 'backlog');
  this.CurrentIteration = this.Stages.findOrCreateByAttribute('name', 'current');
  this.InProgress = this.Stages.findOrCreateByAttribute('name', 'in progress');
  this.UnderReview = this.Stages.findOrCreateByAttribute('name', 'review');
  this.Archive = this.Stages.findOrCreateByAttribute("name", "archive");
  this.Complete = this.Stages.findOrCreateByAttribute("name", "complete");
}
