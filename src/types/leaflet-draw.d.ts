import * as L from "leaflet";

declare module "leaflet" {
  namespace Control {
    interface DrawOptions {
      edit?: {
        featureGroup: L.FeatureGroup;
        remove?: boolean;
      };
      draw?: {
        polygon?: any;
        rectangle?: any;
        circle?: any;
        marker?: boolean;
        polyline?: any;
        circlemarker?: boolean;
      };
    }

    class Draw extends L.Control {
      constructor(options?: DrawOptions);
    }
  }

  namespace Draw {
    class Event {
      static CREATED: string;
      static EDITED: string;
      static DELETED: string;
      static DRAWSTART: string;
      static DRAWSTOP: string;
      static DRAWVERTEX: string;
      static EDITSTART: string;
      static EDITSTOP: string;
      static DELETESTART: string;
      static DELETESTOP: string;
    }

    interface DrawEvent extends L.LeafletEvent {
      layer: L.Layer;
      layerType: string;
    }

    interface EditEvent extends L.LeafletEvent {
      layers: L.LayerGroup;
    }

    interface DeleteEvent extends L.LeafletEvent {
      layers: L.LayerGroup;
    }
  }

  interface Map {
    on(type: "draw:created", fn: (event: L.Draw.DrawEvent) => void, context?: any): this;
    on(type: "draw:edited", fn: (event: L.Draw.EditEvent) => void, context?: any): this;
    on(type: "draw:deleted", fn: (event: L.Draw.DeleteEvent) => void, context?: any): this;
    on(type: "draw:drawstart", fn: (event: L.LeafletEvent) => void, context?: any): this;
    on(type: "draw:drawstop", fn: (event: L.LeafletEvent) => void, context?: any): this;
  }
}