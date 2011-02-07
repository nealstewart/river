var BacklogView = StageView.extend({
  add : function(story, shouldRender) {
    var view = new StoryView({model : story});
    this.storyViews.push(view);

    if (shouldRender) {
      if (this.$('#story-' + story.cid).size() == 0) {
         $(view.render().el).hide();
         $(this.el).append(view.render().el);
         $(view.el).show('slide', {direction: "up"})
         this.recalculateSort();
      }
    }

    return view;
  }
});
