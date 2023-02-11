import { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

export default function EquipItem({
  collectable,
  getCollectables,
  getSignInfo,
}) {
  const { api } = useSubstrateState()

  const [equipping, setEquipping] = useState(false)

  const onEquipItem = async () => {
    setEquipping(true)

    const signInfo = await getSignInfo()

    api.tx.palletRent
      .equipCollectible(collectable.uniqueId)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          getCollectables()
          setEquipping(false)
        }
      })
      .catch(e => {
        console.log(e)
        setEquipping(false)
      })
  }

  return (
    <Button
      basic
      color="green"
      disabled={equipping}
      loading={equipping}
      onClick={onEquipItem}
    >
      Equip
    </Button>
  )
}
