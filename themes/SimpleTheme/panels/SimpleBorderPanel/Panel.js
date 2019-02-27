define([
  "dojo/_base/declare",
  "jimu/BaseWidgetPanel",
  "dijit/_TemplatedMixin",
  "dojo/text!./Panel.html"
], function(declare, BaseWidgetPanel, _TemplatedMixin, template) {
  return declare([BaseWidgetPanel, _TemplatedMixin], {
    templateString: template,
    baseClass: "jimu-panel jimu-border-panel",

    onOpen: function() {
      this.inherited(arguments);
      this._updateTitlePane();
    },

    _updateTitlePane: function() {
      var appConfig = this.config;
      if (!appConfig) return;

      // add label
      if (appConfig.label) {
        this.titleLabelNode.textContent = appConfig.label;
      } else {
        this.titleLabelNode.textContent = "";
      }
    }
  });
});
