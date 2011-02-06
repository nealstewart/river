var CompletedStoryView = Backbone.View.extend({
  className : 'completed-story',
  tagName : 'div',

  template : $('#tmpl-completed_story').template('completed_story'),

  events : {
    "click .move" : "move",
  },

  render : function() {
    this.$('*').remove();
    $(this.el).html('');
    $.tmpl(this.template, this.model.toJSON()).appendTo(this.el);
    $(this.el).attr('id', "story-" + this.model.cid);

    return this;
  },

  "delete" : function(evt) {
    if (confirm("Are you sure you want to delete this story?")) {
      this.model.destroy(); 
    }

    evt.preventDefault();
  },

  move : function(evt) {
    this.model.moveToNextStage();
    evt.preventDefault();
  }
});
