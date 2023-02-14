import { Card } from 'semantic-ui-react'
import Rent from './Rent'
import Item from '../Item'

export default function Rentable({
  collectible,
  getCollectibles,
  getRentedCollectibles,
  getSignInfo,
}) {
  return (
    <Item>
      <Card.Content style={{ wordWrap: 'break-word' }}>
        <Card.Description>{collectible.uniqueId}</Card.Description>
        <Card.Meta style={{ marginTop: '1rem', fontWeight: 'bold' }}>
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
    </Item>
  )
}
