import { useContext } from 'react'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { LoaderContext } from '../contexts'

export default function Unequip({
  collectibleId,
  getCollectibles,
  getEquippedCollectibles,
  getSignInfo,
}) {
  const { api } = useSubstrateState()
  const { showLoader, hideLoader } = useContext(LoaderContext)

  const onUnequipItem = async () => {
    showLoader('Unequipping item...')
    const signInfo = await getSignInfo()
    api.tx.palletRent
      .unequipCollectible(collectibleId)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          getCollectibles()
          getEquippedCollectibles()
          hideLoader()
        }
      })
      .catch(e => {
        console.log(e)
        hideLoader()
      })
  }

  return (
    <Popup
      content="Unequip"
      trigger={
        <Button
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
