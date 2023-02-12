import { useState } from 'react'
import { Button, Form, Header, Modal } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

export default function Rent({
  collectible,
  getCollectibles,
  getRentedCollectibles,
  getSignInfo,
}) {
  const { api } = useSubstrateState()
  const [open, setOpen] = useState(false)
  const [blocksToRent, setBlocksToRent] = useState(
    collectible.minimumRentalPeriod
  )
  const [recurring, setRecurring] = useState(false)
  const [loading, setLoading] = useState(false)

  const isValid = () => {
    if (blocksToRent < collectible.minimumRentalPeriod) return false
    if (blocksToRent > collectible.maximumRentalPeriod) return false
    return true
  }

  const resetForm = () => {
    setBlocksToRent(collectible.minimumRentalPeriod)
    setRecurring(false)
  }

  const onRent = async () => {
    setLoading(true)
    const signInfo = await getSignInfo()

    api.tx.palletRent
      .rent(collectible.uniqueId, blocksToRent, recurring)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          setLoading(false)
          setOpen(false)
          getCollectibles()
          getRentedCollectibles()
          resetForm()
        }
      })
      .catch(e => console.log(e))
  }

  return (
    <Modal
      size="tiny"
      as="form"
      className="form"
      onSubmit={e => {
        e.preventDefault()
        onRent()
      }}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button primary onClick={() => setOpen(true)}>
          Rent
        </Button>
      }
    >
      <Modal.Header>Rent Item</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>{collectible.uniqueId}</Header>

          <Form.Input
            fluid
            type="number"
            min={collectible.minimumRentalPeriod}
            max={collectible.maximumRentalPeriod}
            label="Blocks to Rent"
            value={blocksToRent}
            onChange={e => setBlocksToRent(e.target.value)}
          />

          <Form.Field>
            <label>Recurring</label>
            <Button.Group size="mini">
              <Button
                type="button"
                color={recurring ? 'green' : 'grey'}
                onClick={() => setRecurring(true)}
              >
                Yes
              </Button>
              <Button
                type="button"
                color={!recurring ? 'red' : 'grey'}
                onClick={() => setRecurring(false)}
              >
                No
              </Button>
            </Button.Group>
          </Form.Field>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="button"
          color="black"
          onClick={() => {
            setOpen(false)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!isValid()}
          loading={loading}
          type="submit"
          color="green"
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
