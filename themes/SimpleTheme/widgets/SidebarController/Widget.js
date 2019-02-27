define([
  "dojo/_base/declare",
  "dojo/query",
  "dojo/on",
  "dojo/dom-class",
  "jimu/BaseWidget",
  "jimu/PoolControllerMixin",
  "esri/portal/Portal"
], function(
  declare,
  query,
  on,
  domClass,
  BaseWidget,
  PoolControllerMixin,
  Portal
) {
  return declare([BaseWidget, PoolControllerMixin], {
    baseClass: "jimu-widget-sidebar-controller jimu-main-background",
    allConfigs: [],
    openedWidgetId: "", // the opened widget's id
    activeIconNode: null, // the selected icon node
    groupTooltips: {},

    portal: null,

    postCreate: function() {
      this.inherited(arguments);
      console.log("SidebarController::postCreate");

      // Lag et objekt som holder informasjon om "portalen vår" fra configen.
      // Du kan finne denne i config filen til web appbuilder applikasjonen din som lages
      // når du konfigurerer en applikasjon
      this.portal = new Portal({
        url: this.appConfig.portalUrl
      });

      // Legg til logo i sidebar
      this.addLogo();

      // Legg til alle widgets som er konfigurert til denne controlleren
      this.addWidgets();

      // Legg til brukerens profilbilde i sidebar
      this.addUserThumbnail();
    },

    addLogo: function(appConfig) {
      var config = this.appConfig;

      if (appConfig) {
        config = appConfig;
      }

      if ("logo" in config) {
        // vis logoen om den er konfigurert
        this.logoNode.src = config.logo;
        this.logoNode.alt = config.logo;
      } else {
        // skjul logoen om den ikke er konfigurert
        this.logoNode.style.display = "none";
      }

      if ("title" in config) {
        this.logoNode.title = config.title;
      } else {
        this.logoNode.title = "";
      }
    },

    addUserThumbnail: function() {
      // for å kunne nå "this" på self i asynkrone funksjoner
      var self = this;

      self.portal.load().then(function() {
        // Lag en link som skal brukes for å holde på brukerens profilbilde
        var thumbnailContainer = document.createElement("a");
        thumbnailContainer.className = "icon-node user";

        // Lag bildeelementet som skal peke på bilde
        var thumbnailImg = document.createElement("img");

        // Legg det til containeren
        thumbnailContainer.appendChild(thumbnailImg);

        // Hent url til bilde fra portalen
        var thumbnailUrl = self.portal.user.thumbnailUrl;

        if (thumbnailUrl) {
          // Hvis det finnes bilde, bruk det
          thumbnailImg.src = thumbnailUrl;
          thumbnailImg.alt = thumbnailUrl;
        } else {
          // Ellers default til et bilde vi inkluderer i themet
          // folderUrl peker på ../themes/SimpleTheme/widgets/SidebarController/
          thumbnailImg.src = self.folderUrl + "images/user.png";
          thumbnailImg.alt = thumbnailUrl + "images/user.png";
        }

        // Legg containeren med bilde til i widgeten
        self.containerNode.appendChild(thumbnailContainer);
      });
    },

    addWidgets: function() {
      var allConfigs = this.getAllConfigs();

      // Kun laget støtte for inPanel widgets til dette temaet
      var inPanelWidgetConfigs = allConfigs.filter(function(widgetConfig) {
        return widgetConfig.inPanel;
      });

      if (allConfigs.length !== inPanelWidgetConfigs.length) {
        console.log(
          "WARNING: You have configured widgets with { inPanel: false }. This theme does not support those widgets."
        );
      }

      // add widget icons
      if (inPanelWidgetConfigs && allConfigs.length) {
        var hasOpenAtStartWidget = false,
          firstIconNode;
        for (var i = 0; i < inPanelWidgetConfigs.length; i++) {
          var iconNode = this._createIconNode(
            inPanelWidgetConfigs[i],
            this.widgetContainerNode
          );
          if (i === 0) firstIconNode = iconNode;
          // check if the widget is set to open at start
          // (only open the first widget that is set to open at start)
          if (allConfigs[i].openAtStart && !hasOpenAtStartWidget) {
            this._showWidgetContent(allConfigs[i]);
            this._activateIconNode(iconNode);
            hasOpenAtStartWidget = true;
            this.activeIconNode = iconNode;
          }
        }
        // open the first widget if no widget is set to open
        // at start
        if (!hasOpenAtStartWidget) {
          this._showWidgetContent(allConfigs[0]);
          this._activateIconNode(firstIconNode);
        }
      }
    },

    _createIconNode: function(iconConfig, targetNode) {
      var iconNode, iconImage, iconLabel;

      // create icon node
      iconNode = document.createElement("A");
      iconNode.className = "icon-node";
      iconNode.config = iconConfig;

      if (iconConfig.icon) {
        iconImage = document.createElement("IMG");
        iconImage.src = iconConfig.icon;
      }
      if (iconConfig.label) {
        iconNode.title = iconConfig.label;
        iconImage.alt = iconConfig.label;
        iconLabel = document.createElement("SPAN");
        iconLabel.textContent = iconConfig.label;
      }

      iconNode.appendChild(iconImage);
      iconNode.appendChild(iconLabel);
      targetNode.appendChild(iconNode);

      // check if the icon is a group icon
      if (this._isGroupIcon(iconConfig)) {
        // if group's tooltip has not been created yet
        if (!this.groupTooltips[iconConfig.id]) {
          // create group tooltip and its content
          var groupTooltip = document.createElement("DIV");
          groupTooltip.className = "group-tooltip";
          document.body.appendChild(groupTooltip);
          for (var i = 0; i < iconConfig.widgets.length; i++) {
            this._createIconNode(iconConfig.widgets[i], groupTooltip);
          }
          this.groupTooltips[iconConfig.id] = groupTooltip;
        }
      }

      var self = this;
      this.own(
        on(iconNode, "click", function() {
          self._activateIconNode(this);
          // close group tooltips
          query(".group-tooltip").removeClass("show");

          // if clicked on an active icon node
          if (self.activeIconNode === this) {
            return;
          }
          // clicking on a group icon
          if (self._isGroupIcon(iconConfig)) {
            self.openedWidgetId = null;
            self._positionTooltip(self.groupTooltips[iconConfig.id], this);
            domClass.add(self.groupTooltips[iconConfig.id], "show");
          } else {
            // clicking on a widget icon
            // show panel
            self._showWidgetContent(iconConfig);
          }
          self.activeIconNode = this;
        })
      );

      return iconNode;
    },

    _activateIconNode: function(linkNode) {
      // remove active state from any icon node
      query(".icon-node.jimu-state-active", this.domNode).removeClass(
        "jimu-state-active"
      );
      // add active state the selected icon node
      domClass.add(linkNode, "jimu-state-active");
    },

    _showWidgetContent: function(iconConfig) {
      if (this.openedWidgetId) {
        this.panelManager.closePanel(this.openedWidgetId + "_panel");
      }

      var self = this;

      this.panelManager.showPanel(iconConfig).then(function(panel) {
        panel.setPosition(panel.position, self.panelNode);
        self.openedWidgetId = iconConfig.id;
      });
    },

    _isGroupIcon: function(iconConfig) {
      return iconConfig.widgets && iconConfig.widgets.length > 1;
    },

    _positionTooltip: function _positionTooltip(tooltip, iconNode) {
      var iconBoundingRect = iconNode.getBoundingClientRect();
      tooltip.style.top = iconBoundingRect.top + "px";
      tooltip.style.left =
        (iconBoundingRect.width || iconNode.clientWidth) + "px";
    },

    // on app config changed
    onAppConfigChanged: function(appConfig, reason, changedData) {
      if (reason === "attributeChange") {
        this.addLogo(appConfig);
      }
    }
  });
});
