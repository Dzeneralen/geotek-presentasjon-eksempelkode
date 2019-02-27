define(["dojo/_base/declare", "jimu/BaseWidget"], function(
  declare,
  BaseWidget
) {
  return declare([BaseWidget], {
    // postCreate: function() {
    //   this.inherited(arguments);
    //   console.log("HelloWorldWidget::postCreate");
    // },
    // startup: function() {
    //   this.inherited(arguments);
    //   console.log("HelloWorldWidget::startup");
    // },
    onOpen: function() {
      console.log("HelloWorldWidget::onOpen");
      alert("Hello World!");
    }
    // onClose: function() {
    //   console.log("HelloWorldWidget::onClose");
    // }
    // onMinimize: function(){
    //   console.log('HelloWorldWidget::onMinimize');
    // },
    // onMaximize: function(){
    //   console.log('HelloWorldWidget::onMaximize');
    // },
    // onSignIn: function(credential){
    //   console.log('HelloWorldWidget::onSignIn', credential);
    // },
    // onSignOut: function(){
    //   console.log('HelloWorldWidget::onSignOut');
    // }
    // onPositionChange: function(){
    //   console.log('HelloWorldWidget::onPositionChange');
    // },
    // resize: function(){
    //   console.log('HelloWorldWidget::resize');
    // }
    //methods to communication between widgets:
  });
});
