var StoryView = Backbone.View.extend({
  className : 'story',
  tagName : 'div',

  template : $('#tmpl-story').template('story'),

  events : {
    "blur .description" : "blur",
    "keypress .description" : "keypress",
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
    if (!event.shiftKey && event.keyCode == 13) {
      this.$('.description').blur();

      event.preventDefault();
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
    this.model.destroy(); 
  },

  archive : function(evt) {
    this.model.set({ "stage_id" : archive.id });
    this.model.save();
    evt.preventDefault();
  },

  move : function(evt) {
    var nextStageId;

    switch(this.model.get("stage_id")) {
      case backlog.id:
        nextStageId = currentIteration.id;
        break;
      case currentIteration.id :
        nextStageId = inProgress.id;
        break;
      case inProgress.id :
        nextStageId = underReview.id;
        break;
      case underReview.id :
        nextStageId = complete.id;
        break;
    }
    console.log(nextStageId)

    this.model.set({ "stage_id" : nextStageId });
    this.model.save();
    console.log(this.model);
    evt.preventDefault();
  }
});
