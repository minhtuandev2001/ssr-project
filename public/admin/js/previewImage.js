// choose image and preview html
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
  const uploadInput = uploadImage.querySelector("[upload-image-input]")
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]")
  const buttonClearPreview = uploadImage.querySelector("[button-clear-preview]")
  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
      uploadImagePreview.setAttribute('src', URL.createObjectURL(file))
    }
  })
  buttonClearPreview.addEventListener('click', () => {
    uploadInput.value = ""
    uploadImagePreview.setAttribute('src', "")
  })
}
// end choose image and preview html