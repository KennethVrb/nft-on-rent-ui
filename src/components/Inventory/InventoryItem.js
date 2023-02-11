import { Button, Card, Grid } from 'semantic-ui-react'
import DeleteItem from './DeleteItem'
import EquipItem from './EquipItem'

export default function InventoryItem({
  getCollectables,
  collectable,
  getSignInfo,
  rented = false,
}) {
  const information = rented ? (
    <>
      <span style={{ display: 'block' }}>
        Rental Period: {`${collectable.rentalPeriodicInterval}`}
      </span>
      <span style={{ display: 'block' }}>
        Next Rent Block: {`${collectable.nextRentBlock}`}
      </span>
      <span style={{ display: 'block' }}>
        Recurring:{' '}
        <Button.Group size="mini">
          <Button color={collectable.recurring ? 'green' : 'grey'}>Yes</Button>
          <Button.Or />
          <Button>No</Button>
        </Button.Group>
      </span>
    </>
  ) : (
    <>
      <span style={{ display: 'block' }}>
        Rental Period:{' '}
        {collectable.rentable &&
          `${collectable.minimumRentalPeriod} - ${collectable.maximumRentalPeriod}`}
      </span>
      <span style={{ display: 'block' }}>
        Price Per Block: {collectable.pricePerBlock}
      </span>
      <span>&nbsp;</span>
    </>
  )

  return (
    <Grid.Column>
      <Card>
        <Card.Content style={{ wordWrap: 'break-word' }}>
          <Card.Meta>{rented ? 'Rented' : 'Owned'}</Card.Meta>
          <Card.Description>{collectable.uniqueId}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div>
            <Grid columns={1}>
              <Grid.Column>{information}</Grid.Column>
              <Grid.Column>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button.Group>
                    {!rented && (
                      <Button
                        basic
                        color={collectable.rentable ? 'red' : 'green'}
                      >
                        {collectable.rentable ? 'Stop Renting Out' : 'Rent Out'}
                      </Button>
                    )}
                    <EquipItem
                      collectable={collectable}
                      getCollectables={getCollectables}
                      getSignInfo={getSignInfo}
                    ></EquipItem>
                    {!rented && (
                      <DeleteItem
                        collectable={collectable}
                        getCollectables={getCollectables}
                        getSignInfo={getSignInfo}
                      ></DeleteItem>
                    )}
                  </Button.Group>
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}
