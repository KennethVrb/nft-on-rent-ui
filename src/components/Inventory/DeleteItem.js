import { useState } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

export default function DeleteItem({
  collectible,
  getCollectibles,
  getSignInfo,
}) {
  const { api } = useSubstrateState()

  const [deleting, setDeleting] = useState(false)

  const onDeleteItem = async () => {
    setDeleting(true)

    const signInfo = await getSignInfo()

    api.tx.palletRent
      .burn(collectible.uniqueId)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          setDeleting(false)
          getCollectibles()
        }
      })
      .catch(e => {
        console.log(e)
        setDeleting(false)
      })
  }

  return (
    <Button
      disabled={deleting}
      loading={deleting}
      color="red"
      size="mini"
      icon
      onClick={onDeleteItem}
    >
      <Icon name="trash" />
    </Button>
  )
}
