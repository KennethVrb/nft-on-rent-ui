import { Card } from 'semantic-ui-react'
import Rent from './Rent'

export default function Item({
  collectible,
  getCollectibles,
  getRentedCollectibles,
  getSignInfo,
}) {
  return (
    <Card>
      <Card.Content style={{ wordWrap: 'break-word' }}>
        <Card.Description>{collectible.uniqueId}</Card.Description>
        <Card.Meta style={{ marginTop: '1rem' }}>
          <span style={{ display: 'block' }}>
            Rental Period:{' '}
            {collectible.rentable &&
              `${collectible.minimumRentalPeriod} - ${collectible.maximumRentalPeriod}`}
          </span>
          <span style={{ display: 'block' }}>
            Price Per Block: {collectible.pricePerBlock}
          </span>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Rent
            collectible={collectible}
            getCollectibles={getCollectibles}
            getRentedCollectibles={getRentedCollectibles}
            getSignInfo={getSignInfo}
          ></Rent>
        </div>
      </Card.Content>
    </Card>
  )
}
