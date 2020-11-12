const modelSelect = document.getElementById("#modelSelect")

modelSelect.addEventListener("change", (ev) =>{

  const marker = document.getElementById("#marker")
  marker.removeChild()
  const newModel = document.createElement("a-entity")
  newModel.setAttribute("gltf-model", "#"+ev.target.value)
  marker.appendChild(newModel)

})
