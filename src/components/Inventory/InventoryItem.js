import { Card, Grid } from 'semantic-ui-react'
import DeleteItem from './DeleteItem'
import EquipItem from './EquipItem'
import ToggleRecurring from './ToggleRecurring'
import ToggleRentable from './ToggleRentable'

export default function InventoryItem({
  collectible,
  rentedOutCollectible,
  getCollectibles,
  equippedCollectibles,
  getEquippedCollectibles,
  getSignInfo,
  rented = false,
}) {
  const information = rented ? (
    <>
      <span style={{ display: 'block' }}>
        Rental Period: {`${collectible.rentalPeriodicInterval}`}
      </span>
      <span style={{ display: 'block' }}>
        Next Rent Block: {`${collectible.nextRentBlock}`}
      </span>
      <span style={{ display: 'block' }}>
        <span style={{ marginRight: '0.2rem' }}>Recurring:</span>
        <ToggleRecurring
          collectible={collectible}
          getCollectibles={getCollectibles}
          getSignInfo={getSignInfo}
        ></ToggleRecurring>
      </span>
    </>
  ) : (
    <>
      {collectible.rentable && (
        <>
          <span style={{ display: 'block' }}>
            Rental Period:{' '}
            {collectible.rentable &&
              `${collectible.minimumRentalPeriod} - ${collectible.maximumRentalPeriod}`}
          </span>
          <span style={{ display: 'block' }}>
            Price Per Block: {collectible.pricePerBlock}
          </span>
        </>
      )}

      {!!rentedOutCollectible && (
        <span style={{ display: 'block' }}>
          Rented Out Until Block: {rentedOutCollectible.nextRentBlock}
        </span>
      )}
    </>
  )

  return (
    <Grid.Column>
      <Card>
        <Card.Content style={{ wordWrap: 'break-word' }}>
          <Card.Meta
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            {rented ? 'Rented' : 'Owned'}{' '}
            {!rented && (
              <DeleteItem
                collectible={collectible}
                getCollectibles={getCollectibles}
                getSignInfo={getSignInfo}
              ></DeleteItem>
            )}
          </Card.Meta>
          <Card.Description>{collectible.uniqueId}</Card.Description>
          <Card.Meta style={{ marginTop: '1rem' }}>{information}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div>
            <Grid columns={1}>
              <Grid.Column>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginTop: '-0.5rem',
                  }}
                >
                  {!rented && (
                    <ToggleRentable
                      collectible={collectible}
                      getCollectibles={getCollectibles}
                      getSignInfo={getSignInfo}
                    ></ToggleRentable>
                  )}
                  {(rented || !collectible.rentable) && (
                    <EquipItem
                      collectible={collectible}
                      isRentedOut={!!rentedOutCollectible}
                      equippedCollectibles={equippedCollectibles}
                      getEquippedCollectibles={getEquippedCollectibles}
                      getSignInfo={getSignInfo}
                      style={{ marginTop: '0.5rem' }}
                    ></EquipItem>
                  )}
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}
