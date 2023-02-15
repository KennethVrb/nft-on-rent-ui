import { useState } from 'react'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

export default function Unequip({
  collectibleId,
  getCollectibles,
  getEquippedCollectibles,
  getSignInfo,
}) {
  const { api } = useSubstrateState()
  const [loading, setLoading] = useState(false)

  const onUnequipItem = async () => {
    setLoading(true)
    const signInfo = await getSignInfo()
    api.tx.palletRent
      .unequipCollectible(collectibleId)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          getCollectibles()
          getEquippedCollectibles()
          setLoading(false)
        }
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      })
  }

  return (
    <Popup
      content="Unequip"
      trigger={
        <Button
          loading={loading}
          onClick={onUnequipItem}
          icon
          size="mini"
          color="red"
          style={{
            position: 'absolute',
            right: '-1.5em',
            top: '-1em',
            fontSize: '0.6rem',
            zIndex: 10,
          }}
        >
          <Icon name="close"></Icon>
        </Button>
      }
    ></Popup>
  )
}
