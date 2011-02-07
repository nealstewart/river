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
    "keypress textarea": "textareaHandler",
    "selectstart div" : "selectCanceller",
    "selectstart span" : "selectCanceller",
    "dragstart div" : "selectCanceller",
    "dragstart span" : "selectCanceller"
  },

  selectCanceller : function(evt) {
    evt.preventDefault();
  },

  click: function(evt) {
    if (evt.srcElement == this.$('span')[0] || evt.srcElement == this.el[0]) {
      this.toggleCreator(evt);
    }

    evt.preventDefault();
  },

  textareaHandler: function(evt) {
    if (!evt.shiftKey && evt.keyCode == 13) {
      if (!this.isSubmitting()) {
        this.submitStory();
        evt.preventDefault();
      }
    } else if (evt.keyCode == 27) {
      console.log("toggled");
      this.turnOff();
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

  turnOn : function(evt) {
    var form = this.$('form');
    $(this.el).removeClass('down');
    $(this.el).addClass('up');

    form.removeClass('hidden');
    form.position({
      of: $(this.el),
      my: "center top",
      at: "center bottom"
    });

    form.find('textarea').focus();
  },

  turnOff : function(evt) {
    var form = this.$('form');
    $(this.el).removeClass('up');
    $(this.el).addClass('down');

    form.addClass('hidden');
    form.find('textarea').blur();
  },

  toggleCreator: function(evt, noBlur) {
    var form = this.$('form');

    if (form.hasClass('hidden')) {
      this.turnOn();
    } else {
      this.turnOff(evt, noBlur);
    }


    evt.preventDefault();
  }
});
