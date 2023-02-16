import { useContext } from 'react'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { LoaderContext } from '../contexts'

export default function ToggleRecurring({
  collectible,
  getCollectibles,
  getSignInfo,
}) {
  const { api } = useSubstrateState()
  const { showLoader, hideLoader } = useContext(LoaderContext)

  const onSetRecurring = async recurring => {
    showLoader('Setting recurring...')
    const signInfo = await getSignInfo()

    api.tx.palletRent
      .setRecurring(collectible.uniqueId, recurring)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          hideLoader()
          getCollectibles()
        }
      })
      .catch(e => {
        console.log(e)
        hideLoader()
      })
  }

  return (
    <Button.Group size="mini">
      <Button
        color={collectible.recurring ? 'green' : 'grey'}
        onClick={() => onSetRecurring(true)}
      >
        Yes
      </Button>
      <Button
        color={!collectible.recurring ? 'red' : 'grey'}
        onClick={() => onSetRecurring(false)}
      >
        No
      </Button>
    </Button.Group>
  )
}
