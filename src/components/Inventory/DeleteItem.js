import { useContext } from 'react'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { LoaderContext } from '../contexts'

export default function DeleteItem({
  collectible,
  getCollectibles,
  getSignInfo,
}) {
  const { api } = useSubstrateState()
  const { showLoader, hideLoader } = useContext(LoaderContext)

  const onDeleteItem = async () => {
    showLoader('Deleting item...')

    const signInfo = await getSignInfo()

    api.tx.palletRent
      .burn(collectible.uniqueId)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          hideLoader(false)
          getCollectibles()
        }
      })
      .catch(e => {
        console.log(e)
        hideLoader()
      })
  }

  return (
    <Popup
      content="Delete"
      trigger={
        <Button color="red" size="mini" icon onClick={onDeleteItem}>
          <Icon name="trash" />
        </Button>
      }
    ></Popup>
  )
}
