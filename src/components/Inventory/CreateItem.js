import { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

export default function CreateItem({ getCollectibles, getSignInfo }) {
  const { api } = useSubstrateState()

  const [creating, setCreating] = useState(false)

  const onCreateItem = async () => {
    setCreating(true)

    const signInfo = await getSignInfo()

    api.tx.palletRent
      .mint()
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          setCreating(false)
          getCollectibles()
        }
      })
      .catch(e => {
        console.log(e)
        setCreating(false)
      })
  }

  return (
    <Button
      primary
      disabled={creating}
      loading={creating}
      onClick={onCreateItem}
    >
      Create Item
    </Button>
  )
}
