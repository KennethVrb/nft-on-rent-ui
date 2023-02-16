import { useContext, useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { getImage } from '../../utils'
import { LoaderContext } from '../contexts'

export default function EquipItem({
  collectible,
  isRentedOut,
  equippedCollectibles,
  getEquippedCollectibles,
  getSignInfo,
  style,
}) {
  const { api } = useSubstrateState()

  const [equipped, setEquipped] = useState(false)
  const { showLoader, hideLoader } = useContext(LoaderContext)

  const onEquipItem = async () => {
    showLoader('Equipping item...')

    const signInfo = await getSignInfo()

    const equippedCollectibleImagesMap = equippedCollectibles.map(
      equippedCollectible => ({
        uniqueId: equippedCollectible,
        image: getImage(equippedCollectible),
      })
    )

    const foundEquippedCollectible = equippedCollectibleImagesMap.find(
      equipped =>
        equipped.image.split('_')[0] ===
        getImage(collectible.uniqueId).split('_')[0]
    )

    if (foundEquippedCollectible) {
      await onUnequipItem(foundEquippedCollectible.uniqueId, false)
    }

    api.tx.palletRent
      .equipCollectible(collectible.uniqueId)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          getEquippedCollectibles()
          hideLoader()
        }
      })
      .catch(e => {
        console.log(e)
        hideLoader()
      })
  }

  const onUnequipItem = (uniqueId = null, useLoading = true) => {
    useLoading && showLoader('Unequipping item...')
    return new Promise((resolve, reject) => {
      getSignInfo().then(signInfo => {
        api.tx.palletRent
          .unequipCollectible(uniqueId ? uniqueId : collectible.uniqueId)
          .signAndSend(...signInfo, ({ status }) => {
            if (status.isInBlock) {
              getEquippedCollectibles()
              useLoading && hideLoader()
              resolve()
            }
          })
          .catch(e => {
            console.log(e)
            useLoading && hideLoader()
            reject()
          })
      })
    })
  }

  useEffect(
    () => setEquipped(equippedCollectibles.includes(collectible.uniqueId)),
    [equippedCollectibles, collectible.uniqueId]
  )

  return (
    <Button
      color={equipped ? 'red' : 'blue'}
      disabled={isRentedOut}
      onClick={() => (equipped ? onUnequipItem() : onEquipItem())}
      style={style}
    >
      {equipped ? 'Unequip' : 'Equip'}
    </Button>
  )
}
