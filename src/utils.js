export function createRandomId() {
  return `id-${Math.random().toString(36).slice(2)}`
}

export function getImage(uniqueId) {
  const storedImages = JSON.parse(localStorage.getItem('nft_map')) || {}

  if (storedImages[uniqueId]) return storedImages[uniqueId]

  const imagesInAssets = require
    .context('./assets/items', false, /\.(png)$/)
    .keys()
    .map(image => image.slice(2))
  const usedImages = Object.values(storedImages)
  const unusedImages = []

  for (const image of imagesInAssets) {
    if (!usedImages.includes(image)) unusedImages.push(image)
  }

  let randomImage = null
  if (unusedImages.length) {
    // If all images have been used, just pick a random one
    randomImage = unusedImages[Math.floor(Math.random() * unusedImages.length)]
  } else {
    // Otherwise, pick a random unused image from the unused images
    randomImage =
      imagesInAssets[Math.floor(Math.random() * imagesInAssets.length)]
  }
  storedImages[uniqueId] = randomImage
  localStorage.setItem('nft_map', JSON.stringify(storedImages))
  return randomImage
}
