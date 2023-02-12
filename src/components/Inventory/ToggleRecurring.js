import { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

export default function ToggleRecurring({
  collectible,
  getCollectibles,
  getSignInfo,
}) {
  const { api } = useSubstrateState()
  const [loading, setLoading] = useState(false)

  const onSetRecurring = async recurring => {
    setLoading(true)
    const signInfo = await getSignInfo()

    api.tx.palletRent
      .setRecurring(collectible.uniqueId, recurring)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          setLoading(false)
          getCollectibles()
        }
      })
      .catch(e => console.log(e))
  }

  return (
    <Button.Group size="mini">
      <Button
        loading={!collectible.recurring && loading}
        disabled={loading}
        color={collectible.recurring ? 'green' : 'grey'}
        onClick={() => onSetRecurring(true)}
      >
        Yes
      </Button>
      <Button
        loading={collectible.recurring && loading}
        disabled={loading}
        color={!collectible.recurring ? 'red' : 'grey'}
        onClick={() => onSetRecurring(false)}
      >
        No
      </Button>
    </Button.Group>
  )
}
