export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; OpenStreetMap contributors';

export type MapNoteMarker = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  originalLatitude: number;
  originalLongitude: number;
  index: number;
};

const COORDINATE_GROUP_PRECISION = 5;
const SPREAD_RADIUS_DEGREES = 0.00012;

const groupKey = (latitude: number, longitude: number): string =>
  `${latitude.toFixed(COORDINATE_GROUP_PRECISION)},${longitude.toFixed(COORDINATE_GROUP_PRECISION)}`;

export const spreadOverlappingMarkers = (
  notes: Omit<MapNoteMarker, 'originalLatitude' | 'originalLongitude' | 'index'>[],
): MapNoteMarker[] => {
  const groups = new Map<
    string,
    Omit<MapNoteMarker, 'originalLatitude' | 'originalLongitude' | 'index'>[]
  >();

  notes.forEach(note => {
    const key = groupKey(note.latitude, note.longitude);
    const group = groups.get(key) ?? [];
    group.push(note);
    groups.set(key, group);
  });

  const spread: MapNoteMarker[] = [];
  let index = 1;

  groups.forEach(group => {
    if (group.length === 1) {
      const note = group[0];
      spread.push({
        ...note,
        originalLatitude: note.latitude,
        originalLongitude: note.longitude,
        index: index++,
      });
      return;
    }

    const centerLat =
      group.reduce((sum, note) => sum + note.latitude, 0) / group.length;
    const centerLng =
      group.reduce((sum, note) => sum + note.longitude, 0) / group.length;
    const radius = SPREAD_RADIUS_DEGREES * Math.max(1, Math.ceil(group.length / 4));

    group.forEach((note, groupIndex) => {
      const angle = (2 * Math.PI * groupIndex) / group.length;
      spread.push({
        ...note,
        latitude: centerLat + radius * Math.cos(angle),
        longitude: centerLng + radius * Math.sin(angle),
        originalLatitude: note.latitude,
        originalLongitude: note.longitude,
        index: index++,
      });
    });
  });

  return spread;
};

const LEAFLET_HEAD = `
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
  <script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
  ></script>
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background: #eef2f7;
    }
    .leaflet-control-attribution {
      font-size: 10px;
    }
    .note-marker {
      background: #1e88e5;
      color: #ffffff;
      border: 2px solid #ffffff;
      border-radius: 999px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.28);
    }
    .note-popup-title {
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 6px;
    }
    .note-popup-coords {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 10px;
      font-family: monospace;
    }
    .note-popup-button {
      appearance: none;
      border: 0;
      border-radius: 8px;
      background: #1e88e5;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 12px;
      width: 100%;
    }
  </style>
`;

const createMapShell = (scriptBody: string): string => `<!DOCTYPE html>
<html lang="en">
  <head>${LEAFLET_HEAD}</head>
  <body>
    <div id="map"></div>
    <script>
      (function () {
        var map = L.map('map', {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          dragging: true,
          touchZoom: true,
          tap: true,
        });

        L.tileLayer(${JSON.stringify(OSM_TILE_URL)}, {
          attribution: ${JSON.stringify(OSM_ATTRIBUTION)},
          maxZoom: 19,
        }).addTo(map);

        ${scriptBody}
      })();
    </script>
  </body>
</html>`;

export const buildSingleNoteMapHtml = (
  latitude: number,
  longitude: number,
  title?: string,
): string => {
  const popupTitle = JSON.stringify(title ?? 'Note location');

  return createMapShell(`
        var lat = ${latitude};
        var lng = ${longitude};

        function refreshMapSize() {
          map.invalidateSize(true);
        }

        map.setView([lat, lng], 15);
        L.marker([lat, lng]).addTo(map).bindPopup(${popupTitle}).openPopup();

        map.whenReady(function () {
          setTimeout(refreshMapSize, 100);
          setTimeout(refreshMapSize, 400);
        });
      `);
};

export const buildAllNotesMapHtml = (
  notes: Omit<MapNoteMarker, 'originalLatitude' | 'originalLongitude' | 'index'>[],
): string => {
  const spreadNotes = spreadOverlappingMarkers(notes);
  const notesJson = JSON.stringify(spreadNotes);

  return createMapShell(`
        function escapeHtml(text) {
          return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        }

        function selectNote(noteId) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'noteSelected', noteId: noteId })
            );
          }
        }

        function refreshMapSize() {
          map.invalidateSize(true);
          if (window.__fitAllMarkers) {
            window.__fitAllMarkers();
          }
        }

        var notes = ${notesJson};
        var markers = [];
        var markerById = {};

        notes.forEach(function (note) {
          var icon = L.divIcon({
            className: '',
            html: '<div class="note-marker">' + note.index + '</div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -16],
          });

          var marker = L.marker([note.latitude, note.longitude], { icon: icon }).addTo(map);
          var popupHtml =
            '<div class="note-popup-title">' + escapeHtml(note.title) + '</div>' +
            '<div class="note-popup-coords">' +
              note.originalLatitude.toFixed(5) + ', ' + note.originalLongitude.toFixed(5) +
            '</div>' +
            '<button type="button" class="note-popup-button">View</button>';

          marker.bindPopup(popupHtml, { maxWidth: 240, closeButton: true });
          marker.on('click', function () {
            marker.openPopup();
          });
          marker.on('popupopen', function () {
            var popup = marker.getPopup();
            var element = popup && popup.getElement();
            if (!element) {
              return;
            }
            var button = element.querySelector('.note-popup-button');
            if (button) {
              button.onclick = function () {
                selectNote(note.id);
              };
            }
          });
          markers.push(marker);
          markerById[note.id] = marker;
        });

        window.__fitAllMarkers = function () {
          if (markers.length === 1) {
            map.setView([notes[0].latitude, notes[0].longitude], 15);
            return;
          }
          if (markers.length > 1) {
            var group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.28), {
              maxZoom: 16,
              padding: [36, 36],
            });
          }
        };

        if (markers.length === 0) {
          map.setView([0, 0], 2);
        } else {
          window.__fitAllMarkers();
        }

        window.focusNoteMarker = function (noteId) {
          var marker = markerById[noteId];
          if (!marker) {
            return;
          }
          map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15), { animate: true });
          marker.openPopup();
        };

        map.whenReady(function () {
          setTimeout(refreshMapSize, 100);
          setTimeout(refreshMapSize, 400);
        });
      `);
};

export const buildOpenStreetMapUrl = (latitude: number, longitude: number) =>
  `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;

export const buildAllNotesOpenStreetMapUrl = (
  notes: Pick<MapNoteMarker, 'latitude' | 'longitude'>[],
) => {
  if (notes.length === 0) {
    return 'https://www.openstreetmap.org';
  }
  const first = notes[0];
  return buildOpenStreetMapUrl(first.latitude, first.longitude);
};

export const buildFocusNoteMarkerScript = (noteId: string): string =>
  `window.focusNoteMarker && window.focusNoteMarker(${JSON.stringify(noteId)}); true;`;

export const buildRefreshMapScript = (): string =>
  `window.__fitAllMarkers && window.__fitAllMarkers(); window.dispatchEvent(new Event('resize')); true;`;
