import { Button, Card, Grid } from 'semantic-ui-react'

export default function Item({ item }) {
  console.log(item)
  return (
    <Grid.Column>
      <Card>
        <Card.Content style={{ wordWrap: 'break-word' }}>
          {item.uniqueId}
        </Card.Content>
        <Card.Content extra>
          <div>
            <Grid columns={1}>
              <Grid.Column>
                <span style={{ display: 'block' }}>
                  Rental Period:{' '}
                  {item.rentable &&
                    `${item.minimumRentalPeriod} - ${item.maximumRentalPeriod}`}
                </span>
                <span style={{ display: 'block' }}>
                  Price Per Block: {item.pricePerBlock}
                </span>
              </Grid.Column>
              <Grid.Column>
                <Button>
                  {item.rentable ? 'Stop Renting Out' : 'Rent Out'}
                </Button>
              </Grid.Column>
            </Grid>
          </div>
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}
