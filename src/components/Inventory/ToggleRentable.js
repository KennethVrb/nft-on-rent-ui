import { useState } from 'react'
import { Button, Form, Header, Image, Modal } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { getImage } from '../../utils'

export default function ToggleRentable({
  collectible,
  getCollectibles,
  getSignInfo,
}) {
  const { api } = useSubstrateState()
  const [open, setOpen] = useState(false)
  const [pricePerBlock, setPricePerBlock] = useState(1)
  const [minimumRentalPeriod, setMinimumRentalPeriod] = useState(1)
  const [maximumRentalPeriod, setMaximumRentalPeriod] = useState(1)
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setPricePerBlock(1)
    setMinimumRentalPeriod(1)
    setMaximumRentalPeriod(1)
  }

  const isValid = () => {
    if (minimumRentalPeriod > maximumRentalPeriod) return false
    if (minimumRentalPeriod < 1) return false
    if (maximumRentalPeriod < 1) return false
    if (pricePerBlock < 1) return false
    return true
  }

  const onSetRentable = async () => {
    setLoading(true)
    const signInfo = await getSignInfo()

    api.tx.palletRent
      .setRentable(
        collectible.uniqueId,
        pricePerBlock,
        minimumRentalPeriod,
        maximumRentalPeriod
      )
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          setLoading(false)
          setOpen(false)
          getCollectibles()
          resetForm()
        }
      })
      .catch(e => console.log(e))
  }

  const onSetUnrentable = async () => {
    setLoading(true)

    const signInfo = await getSignInfo()

    api.tx.palletRent
      .setUnrentable(collectible.uniqueId)
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          setLoading(false)
          getCollectibles()
        }
      })
      .catch(e => console.log(e))
  }

  return (
    <>
      {collectible.rentable ? (
        <Button
          loading={loading}
          color="red"
          style={{ marginTop: '0.5rem' }}
          onClick={() => onSetUnrentable()}
        >
          Stop Renting Out
        </Button>
      ) : (
        <Modal
          size="tiny"
          as="form"
          className="form"
          onSubmit={e => {
            e.preventDefault()
            onSetRentable()
          }}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={
            <Button
              primary
              style={{ marginTop: '0.5rem' }}
              onClick={() => setOpen(true)}
            >
              Rent Out
            </Button>
          }
        >
          <Modal.Header>Make Rentable</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>
                <Image
                  src={require(`../../assets/items/${getImage(
                    collectible.uniqueId
                  )}`)}
                ></Image>
              </Header>

              <Form.Input
                fluid
                type="number"
                min="1"
                label="Price Per Block"
                value={pricePerBlock}
                onChange={e => setPricePerBlock(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
              <Form.Input
                fluid
                type="number"
                min="1"
                label="Minimum Rental Period"
                value={minimumRentalPeriod}
                onChange={e =>
                  setMinimumRentalPeriod(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                style={{ marginBottom: '1rem' }}
              />
              <Form.Input
                fluid
                type="number"
                min="1"
                label="Maximum Rental Period"
                value={maximumRentalPeriod}
                onChange={e =>
                  setMaximumRentalPeriod(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              />
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
      )}
    </>
  )
}
