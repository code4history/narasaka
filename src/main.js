window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("sw.js")
      .then(function(registration) {
        console.log("sw registed.");
      }).catch(function(error) {
      console.warn("sw error.", error);
    });
  }
});
async function main() {
  const {isMapboxURL, transformMapboxUrl} = await import("https://unpkg.com/maplibregl-mapbox-request-transformer@0.0.2/src/index.js");
  const accessToken =
      "pk.eyJ1IjoicmVraXNoaWtva3VkbyIsImEiOiJjazRoMmF3dncwODU2M2ttdzI2aDVqYXVwIn0.8Hb9sekgjfck6Setxk5uVg";
  const style = "mapbox://styles/moritoru/ck4s6w8bd0sb51cpp9vn7ztty";
  const transformRequest = (url, resourceType) => {
    if (isMapboxURL(url)) {
      const ret = transformMapboxUrl(url, resourceType, accessToken)
      return ret;
    }
    return {url};
  }

  const latLng = [34.70577262309317, 135.82991665619645];
  const zoom = 14;
  const minZoom = 5;
  const maxZoom = 21;
  const poiBuf = "narasaka_pois.fgb";
  const koazaBuf = "narasaka_koaza.fgb";
  const mymap = L.map("mapid", {
    minZoom: minZoom,
    maxZoom
  }).setView(latLng, zoom);
  const roundDec = (val, level) => {
    const powVal = Math.pow(10, level);
    return Math.round(val * powVal) / powVal;
  };
  L.maplibreGL({
    minZoom: minZoom - 1,
    maxZoom,
    style,
    transformRequest
  }).addTo(mymap);
  L.control
    .locate({
      icon: "fa fa-crosshairs",
    })
    .addTo(mymap);
  L.control
    .attribution({
      prefix: `石造文化財アイコン: © 2022 T.N.K.Japan, Code for History, <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC BY-SA 4.0</a>`
    })
    .addTo(mymap);

  const closePoiPane = () => {
    const container = document.querySelector('#container');
    const pane = container.querySelector("#poipane");
    const poi_content = pane.querySelector(".poipane-content");
    container.classList.toggle('open');
    container.classList.toggle('close');
    container.classList.add('transition');
    setTimeout(() => {
      container.classList.remove('transition');
      let count = 0;
      const intervalID = setInterval(() => {
        mymap.invalidateSize();
        count += 1000;
        if (count > 600) clearInterval(intervalID);
      }, 500);
    }, 100);
    poi_content.innerHTML = "";
  }

  const preparePoiPane = (layer) => {
    const container = document.querySelector('#container');
    const pane = container.querySelector("#poipane");
    const poi_content = pane.querySelector(".poipane-content");

    poi_content.innerHTML = layer.target ? layer.target.html : "";
    container.classList.add('open');
    container.classList.remove('close');
    container.classList.add('transition');
    setTimeout(() => {
      container.classList.remove('transition');
      let count = 0;
      const intervalID = setInterval(() => {
        mymap.invalidateSize();
        if (layer.target instanceof L.Marker) {
          mymap.panTo(layer.latlng);
        } else {
          mymap.panTo(layer.target.getBounds().getCenter());
        }
        count += 1000;
        if (count > 600) clearInterval(intervalID);
      }, 500);
    }, 100);
  };

  const container = document.querySelector('#container');
  const pane = container.querySelector("#poipane");
  const close_button = pane.querySelector(".poipane-close-button");
  close_button.addEventListener("click", closePoiPane);

  fetch(koazaBuf).then(async (response) => {
    for await (let feature of flatgeobuf.deserialize(response.body)) {
      feature = Quyuan.templateExtractor({
        geojson: feature,
        templates: {
          html: popupHtmlTemplate,
        }
      });
      const coords = feature.geometry.coordinates.map(ring => ring.map(coords => coords.reverse()));
      console.log(coords);
      const polygon = L.polygon(coords, {
        weight: 3,
        fillOpacity: 0.3,
        color: 'red'
      });
      console.log(polygon);
      polygon.html = feature.result.html;
      polygon.name = feature.properties.name;
      polygon.addEventListener("click", preparePoiPane);
      polygon.addTo(mymap);
    }
  });

  fetch(poiBuf).then(async (response) => {
    for await (let feature of flatgeobuf.deserialize(response.body)) {
      feature = Quyuan.templateExtractor({
        geojson: feature,
        templates: {
          pin: iconTemplate,
          html: popupHtmlTemplate,
        }
      });
      if (feature.geometry) {
        const icons = feature.result.pin.split(',');
        const iconUrl = icons[0];
        const width = parseInt(icons[1]);
        const height = parseInt(icons[2]);
        console.log(iconUrl, width, height);
        const iconOptions = {
          iconUrl,
          iconSize: [width, height],
          iconAnchor: [width / 2, height],
          popupAnchor: [0, -1 * height],
        };
        const marker = L.marker(feature.geometry.coordinates.reverse(), {
          icon: L.icon(iconOptions),
        });
        marker.html = feature.result.html;
        marker.name = feature.properties.name;
        marker.addEventListener("click", preparePoiPane);
        marker.addTo(mymap);
      }
    }
  });
}
main();
