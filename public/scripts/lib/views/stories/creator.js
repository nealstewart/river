// okay, so i want to make the create task make a new card appear above it.
var StoryCreator = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(
      this, 
      "successfulCreation", 
      "failedCreation", 
      "toggleCreator"
    );
  },

  events: {
    "click": "click",
    "keydown textarea": "textareaHandler",
    "keypress textarea": "textareaHandler"
  },

  click: function(evt) {
    if (evt.srcElement == this.el[0]) { // only toggle if you click the link
      this.toggleCreator();
    }

    evt.preventDefault();
  },

  textareaHandler: function(evt) {
    if (!evt.shiftKey && evt.keyCode == 13) {
      if (!this.isSubmitting()) {
        this.submitStory();
        evt.preventDefault();
      }
    }
  },

  setSubmitting: function(val) {
    this._submitting = !!val;
  },

  isSubmitting: function(val) {
    this._submitting = val;
  },

  submitStory: function() {
    var storyToAdd = $.trim(this.$('textarea').val());
    
    if (storyToAdd !== "") {
      this.collection.create(
        {
          stage_id: this.model.id,
          description: storyToAdd
        },
        {
          success: this.successfulCreation,
          failure: this.failedCreation
        }
      );
    }
  },

  successfulCreation: function() {
    this.setSubmitting(false);
    this.$('textarea').val('');
  },

  failedCreation: function() {
    this.setSubmitting(false);
    throw "not implemented";
  },

  toggleCreator: function(evt) {
    var form = this.$('form');

    if (form.hasClass('hidden')) {
      form.removeClass('hidden');
      form.position({
        of: $(this.el),
        my: "center bottom",
        at: "center top"
      });

      form.find('textarea').focus();

    } else {
      form.addClass('hidden');
      form.find('textarea').val('').blur();
    }
  }
});
