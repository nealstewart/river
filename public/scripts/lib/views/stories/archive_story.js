var ArchiveStoryView = Backbone.View.extend({
  className : 'archive-story',
  tagName : 'div',

  template : $('#tmpl-archive_story').template('archive_story'),

  events : {
    "blur .description" : "blur",
    "keypress .description" : "keypress",
    "click .edit" : "onDblclick",
    "click .delete" : "delete",
    "click .move" : "move",
    "dblclick .description" : "onDblclick"
  },

  keypress : function(event) {
    if (!event.shiftKey && event.keyCode == 13) {
      this.$('.description').blur();

      event.preventDefault();
    }
  },

  blur : function(event) {
    var description = this.$('.description');
    description.removeAttr('contenteditable');


    this.model.set({"description" : description.text()});
    this.model.save();
  },

  onDblclick : function(evt) {
    var self = $(this.el);
    var description = this.$('.description');

    description.attr('contenteditable', true);
    description.focus();

    var length = description.text().length;
    var descriptionDomEl = description[0];

    var range, selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(descriptionDomEl);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }

    evt.preventDefault();
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
