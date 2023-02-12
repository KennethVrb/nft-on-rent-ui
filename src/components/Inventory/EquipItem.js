import { useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

export default function EquipItem({
  collectible,
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

  const onUnequipItem = async () => {
    setLoading(true)

    const signInfo = await getSignInfo()

    api.tx.palletRent
      .unequipCollectible(collectible.uniqueId)
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

  useEffect(
    () => setEquipped(equippedCollectibles.includes(collectible.uniqueId)),
    [equippedCollectibles, collectible.uniqueId]
  )

  return (
    <Button
      color={equipped ? 'red' : 'blue'}
      disabled={loading}
      loading={loading}
      onClick={equipped ? onUnequipItem : onEquipItem}
      style={style}
    >
      {equipped ? 'Unequip' : 'Equip'}
    </Button>
  )
}
