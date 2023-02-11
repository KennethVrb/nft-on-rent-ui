import { useState } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

export default function DeleteItem({
  collectable,
  getCollectables,
  getSignInfo,
}) {
  const { api } = useSubstrateState()

  const [deleting, setDeleting] = useState(false)

  const onDeleteItem = async () => {
    setDeleting(true)

    const signInfo = await getSignInfo()

    api.tx.palletRent
      .burn(collectable.uniqueId)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          getCollectables()
          setDeleting(false)
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
      basic
      color="red"
      icon
      onClick={onDeleteItem}
    >
      <Icon name="trash" />
    </Button>
  )
}
