define(['dojo/_base/declare', 'jimu/BaseWidget'],
function(declare, BaseWidget) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: 'live-feed',
    // this property is set by the framework when widget is loaded.
    // name: 'LiveFeed',
    // add additional properties here

    //methods to communication with app container:
    postCreate: function() {
      this.inherited(arguments);
      console.log('LiveFeed::postCreate');
    }

    // startup: function() {
    //   this.inherited(arguments);
    //   console.log('LiveFeed::startup');
    // },

    // onOpen: function(){
    //   console.log('LiveFeed::onOpen');
    // },

    // onClose: function(){
    //   console.log('LiveFeed::onClose');
    // },

    // onMinimize: function(){
    //   console.log('LiveFeed::onMinimize');
    // },

    // onMaximize: function(){
    //   console.log('LiveFeed::onMaximize');
    // },

    // onSignIn: function(credential){
    //   console.log('LiveFeed::onSignIn', credential);
    // },

    // onSignOut: function(){
    //   console.log('LiveFeed::onSignOut');
    // }

    // onPositionChange: function(){
    //   console.log('LiveFeed::onPositionChange');
    // },

    // resize: function(){
    //   console.log('LiveFeed::resize');
    // }

    //methods to communication between widgets:

  });

});
