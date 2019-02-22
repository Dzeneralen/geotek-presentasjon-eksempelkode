define([
  "dojo/_base/declare",
  "jimu/BaseWidget",
  "esri/layers/StreamLayer",
  "esri/symbols/ObjectSymbol3DLayer"
], function(declare, BaseWidget, StreamLayer, ObjectSymbol3DLayer) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // Custom widget code goes here

    baseClass: "live-feed",
    // this property is set by the framework when widget is loaded.
    // name: 'LiveFeed',
    // add additional properties here

    //methods to communication with app container:
    postCreate: function() {
      this.inherited(arguments);
      console.log("LiveFeed::postCreate");
    },

    startup: function() {
      this.inherited(arguments);
      console.log("LiveFeed::startup");

      // opprett laget ved hjelp av metoden under
      var streamLayer = this.getStreamLayerLiveFeed();

      // legg laget til kartet
      this.sceneView.map.add(streamLayer);

      // sett opp en lytter på sceneView for å få med når laget er lagt til
      var self = this; // bruker for å kunne nå vår egen "Widget" konteksten inne i asynkrone funskjoner
      this.sceneView
        .whenLayerView(streamLayer)
        .then(function(layerView) {
          // når vi får kontakt..

          // oppdater GUI og vis at vi er tilkoblet
          self.showWidgetAsConnected();

          layerView.watch("connectionStatus", function(value) {
            // når connectionStatus endrer seg..
            if (value === "connected") {
              self.showWidgetAsConnected();
            } else {
              self.showWidgetAsDisconnected();
            }
          });
        })
        .catch(function(error) {
          // om noe gikk galt havner vi her, vis brukeren en feilmelding i widgeten
          self.showWidgetAsDisconnected();
        });
    },

    showWidgetAsConnected: function() {
      this.statusTextNode.innerText =
        "Har kontakt med tjenesten og mottar oppdateringer.";
    },

    showWidgetAsDisconnected: function() {
      this.statusTextNode.innerText =
        "Fikk ikke kontakt med tjenesten. Vennligst ta kontakt med support eller prøv igjen senere.";
      this.statusTextNode.style.color = "#ff0000";
    },

    getStreamLayerLiveFeed: function() {
      // opprett en renderer ved hjelp av metoden under
      var renderer = this.getUniqueValueRenderer();

      // opprett streamlayer som henter live data fra en GeoEvent server
      var layer = new StreamLayer({
        url:
          "https://demo09.geodata.no/arcgis/rest/services/Flight_Simulator_Stream/StreamServer",
        purgeOptions: {
          displayCount: 1000
        },
        renderer: renderer,
        elevationInfo: {
          // elevation mode som vil plassere objektene våre over terreng og andre 3D modeller
          mode: "absolute-height",
          offset: 1.5
        }
      });

      return layer;
    },

    getUniqueValueRenderer: function() {
      // Mapping over hvilket symbol featuren skal ha ut ifra hvilken verdi den har
      // i feltet "name"
      var featureNameToSymbolMapping = [
        {
          value: "Flybuss",
          name: "buss"
        },
        {
          value: "Trapp1",
          name: "bagasjebil"
        },
        {
          value: "BagasjeTruck1",
          name: "bagasjebil"
        },
        {
          value: "Fly Track_1",
          name: "FlyNorwegian"
        },
        {
          value: "Fly Track_2",
          name: "FlySAS"
        },
        {
          value: "Fly Track_3",
          name: "FlyNorwegian"
        }
      ];

      // Lager default symbol om renderer finner en ukjent verdi i feltet "name".
      // Alle ukjente objekt blir da busser her
      var defaultSymbol = this.get3DSymbolFor("buss");

      // Lager symboler for alle andre verdier i mappingen over
      var uniqueValueInfos = featureNameToSymbolMapping.map(s => {
        return {
          value: s.value,
          symbol: this.get3DSymbolFor(s.name)
        };
      });

      // Lager en unique value renderer. Det den gjør er å sjekke verdien i feltet "name" og finner
      // tilhørende symbol om mulig, hvis ikke bruker den default symbol på featuren
      var renderer = {
        type: "unique-value",
        field: "name",
        defaultSymbol: defaultSymbol,
        uniqueValueInfos: uniqueValueInfos,
        visualVariables: [
          {
            type: "rotation",
            field: "bearing"
          }
        ]
      };

      return renderer;
    },

    get3DSymbolFor: function(name) {
      var pointSymbol = {
        type: "point-3d",
        visualVariables: [
          {
            type: "rotation",
            // "bearing" feltet på featuren styrer hvor mye rotasjon den vil få når den blir tegna
            field: "bearing"
          }
        ], // autocasts som new PointSymbol3D(), trenger ikke lage det med new PointSym.. i 4.X
        symbolLayers: [
          {
            type: "object",
            anchor: "center",
            heading: 180,
            resource: {
              href: "https://demo09.geodata.no/geotek/symbol/" + name + ".json"
            }
          }
        ]
      };

      return pointSymbol;
    }

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
