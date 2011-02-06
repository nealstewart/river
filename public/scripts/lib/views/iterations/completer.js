var IterationCompleter = Backbone.View.extend({
  events : {
    "click" : "click"
  },

  click : function(evt) {
    // move the stuff that's unfinished to the current iteration
    // this simulates the fact that anything that's not complete will need
    // to be moved along.
    var inProgressStories = Application.InProgress.getStories();
    var underReviewStories = Application.UnderReview.getStories();  

    underReviewStories.each(function(story) {
      story.set({ "stage_id" : Application.CurrentIteration.id });
      story.save();
    });

    inProgressStories.each(function(story) {
      story.set({ "stage_id" : Application.CurrentIteration.id });
      story.save();
      console.log(story);
    });

    var iterationOwner = Application.Iterations.create({});

    // this entire method is going to be replaced by a call to server side stuff that refreshes all of the current lists. WOOHOO!
    // get the completed stories that haven't been assigned to an iteration.
    var completeStories = Application.Complete.getStories();
    completeStories = completeStories.select(function(story){ return !story.get("iteration_id");  })
    
    // assign them to this new iteration
    _(completeStories).each(function(story) {
      story.set({"iteration_id" : iterationOwner.id});
      story.save();
    });

    // and that's it!

    evt.preventDefault();
  }
});
