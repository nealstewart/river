var StoryView = Backbone.View.extend({
  className : 'story',
  tagName : 'div',

  template : $('#tmpl-story').template('story'),

  events : {
    "dblclick" : "onDblclick",
    "blur" : "blur",
    "keypress" : "keypress",
    "click .archive" : "archive",
    "click .delete" : "delete",
    "click .move" : "move"
  },

  keypress : function(event) {
    if (event.keyCode == 13) {
      $(this.el).blur();

      event.preventDefault();
    }
  },

  blur : function(event) {
    var self = $(this.el);
    self.removeAttr('contenteditable');
    self.parent().sortable('enable');

    var model = self.data('river-model');
    model.set({description : self.text()});
    model.save();
  },

  onDblclick : function(evt) {
    var that = this.el,
        self = $(this.el);

    self.attr('contenteditable', true);
    self.parent().sortable('disable');
    
    self.focus();
  },

  render : function() {
    this.$('*').remove();
    $(this.el).html('');
    $.tmpl(this.template, this.model.toJSON()).appendTo(this.el);
    var highlight = this.make('div', {className: 'highlight'});
    $(this.el).data('river-model', this.model);
    $(this.el).attr('id', "story-" + this.model.cid);

    return this;
  },

  delete : function(evt) {
    this.model.destroy(); 
  },

  archive : function(evt) {
    console.log(this.model.collection)
    this.model.set({"stage_id" : archive.id});
    this.model.save();
    evt.preventDefault();
  }
});
