var Stage = Backbone.Model.extend({
  getStories : function() {
    var stageId = this.id;
    var storyArray = Application.Stories.select(function(story){
      return story.get("stage_id") === stageId;
    });

    return new StoryList(storyArray);
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
