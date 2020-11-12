let currentMarkers = [];

const assets = {
  air: {
    url: "/Models/tornado/scene.gltf",
    rotation: "15 -70 -35",
    scale: ".015 .04 .015",
    position: "0 0 0",
  },
  airearth: {
    url: "/Models/catapult_animation/scene.gltf",
    rotation: "90 -20 -15",
    scale: ".25 .25 .25",
    position: "0 0 0",
  },
  airfire: {
    url: "/Models/starcluster/scene.gltf",
    rotation: "15 90 0",
    scale: ".0025 .0025 .0025",
    position: "0 3 0",
  },
  airwater: {
    url: "/Models/cloud/scene.gltf",
    rotation: "60 0 0",
    scale: ".5 .5 .5",
    position: "0 0 0",
  },
  earth: {
    url: "/Models/fels/scene.gltf",
    rotation: "0 90 90",
    scale: ".25 .25 .25",
    position: "0 0 0",
  },
  earthfire: {
    url: "/Models/volcano/scene.gltf",
    rotation: "90 0 0",
    scale: "-90 180 5",
    position: "0 0 0",
  },
  earthwater: {
    url: "/Models/tree/scene.gltf",
    rotation: "90 0 0",
    scale: ".5 .75 .5",
    position: "0 0 0",
  },
  fire: {
    url: "/Models/fire_animation/scene.gltf",
    rotation: "90 0 0",
    scale: ".5 .3 .5",
    position: "0 0 2",
  },
  firewater: {
    url: "/Models/train/scene.gltf",
    rotation: "90 0 0",
    scale: ".02 .05 .05",
    position: "-.75 0 -1",
  },
  water: {
    url: "/Models/water_animation/scene.gltf",
    rotation: "90 0 0",
    scale: ".015 .05 .015",
    position: "0 0 0",
  },
 };


const markers = {
  fire: "/markers/firetext.patt",
  earth: "/markers/earthtext.patt",
  water: "/markers/watertext.patt",
  air: "/markers/airtext.patt",
};

AFRAME.registerComponent("setup", {
  init: function () {
    const scene = this.el;

    //create assets and append to scene
    const aAsset = document.createElement("a-assets");

    for (key in assets) {
      const asset = document.createElement("a-asset-item");
      asset.setAttribute("id", key);
      asset.setAttribute("src", assets[key].url);

      aAsset.appendChild(asset);
    }
    scene.appendChild(aAsset);

    //create markers and initialize the model to be displayed
    for (key in markers) {
      const marker = document.createElement("a-marker");
      marker.setAttribute("id", key);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", markers[key]);
      marker.setAttribute("register-events", true);

      const entity = document.createElement("a-gltf-model");
      entity.setAttribute("animation-mixer", "loop: repeat");
      setEntityAttributes(entity, key);

      marker.appendChild(entity);

      scene.appendChild(marker);
    }

    console.log("SCENE", scene);
  },
});

AFRAME.registerComponent("register-events", {
  init: function () {
    const marker = this.el;
    console.log("REGISTER EVENTS ON ", marker.id);

    marker.addEventListener("markerFound", () => {
      const markerId = marker.id;
      console.log("Marker FOUND: ", markerId);
      console.log("Adding to list of found markers");
      console.log("FOUND MARKER'S ENTITY", marker.childNodes[0]);
      currentMarkers.push(marker);
      console.log("CURRENT MARKERS ARE", currentMarkers);
      if (currentMarkers.length > 1) combineModels(currentMarkers);
    });
    marker.addEventListener("markerLost", () => {
      resetModel(marker);
      console.log("Current Markers are", currentMarkers);
    });
  },
});

function resetModel(marker) {
  // reset model to factory default
  if (marker.id !== marker.childNodes[0].getAttribute("src").slice(1))
    clearAndCreate(marker, marker.id);

  //remove the reset marker from the list of seen marker
  currentMarkers = currentMarkers.filter((el) => el.id !== marker.id);

  //reset the other marker left in the list to factory default, since there is no other marker to interact with
  if (currentMarkers.length > 0) {
    const otherMarker = currentMarkers[0];
    clearAndCreate(otherMarker, otherMarker.id);
  }
}

function combineModels(currentMarkers) {
  console.log("COMBINING", currentMarkers[0]);
  console.log("WITH", currentMarkers[1]);
  const ids = [currentMarkers[0].id, currentMarkers[1].id];
  ids.sort();
  const combinedAssetName = ids[0] + ids[1];
  console.log("COMBINED ASSET NAME", combinedAssetName);

  currentMarkers.forEach((marker) => {
    clearAndCreate(marker, combinedAssetName);
  });
}

function setEntityAttributes(entity, assetKey) {
  console.log("SETTING ATTIBUTES OF", entity);
  console.log("TO MODEL", assetKey);

  entity.setAttribute("src", `#${assetKey}`);
  entity.setAttribute("scale", assets[assetKey].scale);
  entity.setAttribute("rotation", assets[assetKey].rotation);
  entity.setAttribute("position", assets[assetKey].position);
}

function clearAndCreate(marker, assetKey) {
  console.log("========CLEARING=======");
  marker.removeChild(marker.firstChild);

  const entity = document.createElement("a-gltf-model");
  entity.setAttribute("animation-mixer", "loop: repeat");
  setEntityAttributes(entity, assetKey);

  marker.appendChild(entity);
}
