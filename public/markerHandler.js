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
  avatar: {
    url: "/Models/avatar/scene.gltf",
    rotation: "0 -90 -90",
    scale: "1 1 1",
    position: "0 0 0",
  }
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

      //create and append all models relevant to marker
      for (asset in assets) {
        if (asset.includes(key) || asset==="avatar") {
          const entity = document.createElement("a-gltf-model");
          entity.setAttribute("id", asset);
          entity.setAttribute("animation-mixer", "loop: repeat");
          entity.setAttribute("visible", asset === key ? true : false);
          setEntityAttributes(entity, asset);

          marker.appendChild(entity);
        }
      }

      scene.appendChild(marker);
    }
  },
});

AFRAME.registerComponent("register-events", {
  init: function () {
    const marker = this.el;

    marker.addEventListener("markerFound", () => {
      currentMarkers.push(marker);
      if (currentMarkers.length > 1) combineModels(currentMarkers);
    });
    marker.addEventListener("markerLost", () => {
      resetModel(marker);
    });
  },
});

function resetModel(marker) {
  // reset model to factory default
  if (marker.id !== marker.childNodes[0].getAttribute("src").slice(1))
    setVisbility(marker, marker.id);

  //remove the reset marker from the list of seen marker
  currentMarkers = currentMarkers.filter((el) => el.id !== marker.id);

  //reset the other marker left in the list to factory default, since there is no other marker to interact with
  if (currentMarkers.length > 0) {
   currentMarkers.forEach(otherMarker =>{
    setVisbility(otherMarker, otherMarker.id);
   })
  }
}

function combineModels(currentMarkers) {
  if(currentMarkers.length===2){
  const ids = [currentMarkers[0].id, currentMarkers[1].id];
  ids.sort();
  const combinedAssetName = ids[0] + ids[1];


    setVisbility(currentMarkers[0], combinedAssetName);
    setVisbility(currentMarkers[1], "none");

  }
  if(currentMarkers.length===3){
    currentMarkers.forEach(marker => {
      setVisbility(marker, marker.id)
    })
  }
  if (currentMarkers.length===4){
    setVisbility(currentMarkers[0], "avatar")
    setVisbility(currentMarkers[1], "none");
    setVisbility(currentMarkers[2], "none");
    setVisbility(currentMarkers[3], "none");
  }
}

function setEntityAttributes(entity, assetKey) {
  entity.setAttribute("src", `#${assetKey}`);
  entity.setAttribute("scale", assets[assetKey].scale);
  entity.setAttribute("rotation", assets[assetKey].rotation);
  entity.setAttribute("position", assets[assetKey].position);
}

function setVisbility(marker, assetKey) {
  marker.childNodes.forEach((model) => {
    model.setAttribute("visible", model.id === assetKey ? true : false);
  });
}
