var Story = Backbone.Model.extend({
  getStage : function() {
    return Application.Stages.get(this.get("stage_id"));
  },
  moveToNextStage : function() {
    var nextStageId = this.getStage().get("next_stage_id");
    this.set({ "stage_id" : nextStageId});
    this.save();
  }
});

var StoryList = Backbone.Collection.extend({
  model : Story,
  localStorage : new Store('river-stories') ,
  comparator : function(story) {
    return story.get('sort_num');
  },
});
