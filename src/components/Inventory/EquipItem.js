import { useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { getImage } from '../../utils'

export default function EquipItem({
  collectible,
  isRentedOut,
  equippedCollectibles,
  getEquippedCollectibles,
  getSignInfo,
  style,
}) {
  const { api } = useSubstrateState()

  const [loading, setLoading] = useState(false)
  const [equipped, setEquipped] = useState(false)

  const onEquipItem = async () => {
    setLoading(true)

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
          setLoading(false)
        }
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      })
  }

  const onUnequipItem = (uniqueId = null, useLoading = true) => {
    useLoading && setLoading(true)
    return new Promise((resolve, reject) => {
      getSignInfo().then(signInfo => {
        api.tx.palletRent
          .unequipCollectible(uniqueId ? uniqueId : collectible.uniqueId)
          .signAndSend(...signInfo, ({ status }) => {
            if (status.isInBlock) {
              getEquippedCollectibles()
              useLoading && setLoading(false)
              resolve()
            }
          })
          .catch(e => {
            console.log(e)
            useLoading && setLoading(false)
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
      disabled={loading || isRentedOut}
      loading={loading}
      onClick={equipped ? onUnequipItem : onEquipItem}
      style={style}
    >
      {equipped ? 'Unequip' : 'Equip'}
    </Button>
  )
}
