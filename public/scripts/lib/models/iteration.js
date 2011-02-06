var Iteration = Backbone.Model.extend({});

var IterationList = Backbone.Collection.extend({
  model: Iteration,
  localStorage : new Store('river-iterations')
});
