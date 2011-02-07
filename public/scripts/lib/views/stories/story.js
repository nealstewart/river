var StoryView = Backbone.View.extend({
  className : 'story',
  tagName : 'div',

  template : $('#tmpl-story').template('story'),

  events : {
    "blur .description" : "blur",
    "keypress .description" : "keypress",
    "keydown .description" : "keypress",
    "click .edit" : "onDblclick",
    "click .archive" : "archive",
    "click .delete" : "delete",
    "click .move" : "move",
    "mousedown *" : "mousedown",
    "dblclick .description" : "onDblclick"
  },

  mousedown : function(evt) {
    var currentActiveElement,
        elementBeingClicked,
        elementsBelongToSameStory;

    currentActiveElement = $(document.activeElement);

    if (currentActiveElement.hasClass('description')) {
      elementBeingClicked = $(evt.srcElement);

      elementsBelongToSameStory = elementBeingClicked.closest('.story')[0] === currentActiveElement.closest('.story')[0];

      if (!elementsBelongToSameStory) {
        currentActiveElement.blur();
      }
    }
  },

  keypress : function(event) {
    console.log(event.keyCode)
    if (!event.shiftKey && event.keyCode == 13) {
      this.$('.description').blur();

      event.preventDefault();
    } else if (event.keyCode == 27) {
      this.$('.description').blur();
    }

  },

  blur : function(event) {
    var description = this.$('.description');
    description.removeAttr('contenteditable');

    $(this.el).parent().sortable('enable');

    this.model.set({"description" : description.text()});
    this.model.save();
  },

  onDblclick : function(evt) {
    var self = $(this.el);
    var description = this.$('.description');

    description.attr('contenteditable', true);
    self.parent().sortable('disable');
    description.focus();

    var length = description.text().length;
    var descriptionDomEl = description[0];

    var range, selection;
    if(document.createRange) {
        range = document.createRange();
        range.selectNodeContents(descriptionDomEl);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

    } else if(document.selection) { 
        range = document.body.createTextRange();
        range.moveToElementText(contentEditableElement);
        range.collapse(false);
        range.select();
    }

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

  archive : function(evt) {
    if (confirm("Are you sure you want to archive this story?")) {
      this.model.set({ "stage_id" : Application.Archive.id });
      this.model.save();
    }

    evt.preventDefault();
  },

  move : function(evt) {
    this.model.moveToNextStage();
    evt.preventDefault();
  }
});
