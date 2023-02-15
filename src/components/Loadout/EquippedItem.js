import { Card, Image } from 'semantic-ui-react'
import { getImage } from '../../utils'
import Item from '../Item'
import Unequip from './Unequip'

export default function EquippedItem({
  collectibleId,
  getCollectibles,
  getEquippedCollectibles,
  getSignInfo,
  style,
}) {
  return (
    <Item style={{ ...style }}>
      <Card.Content style={{ wordWrap: 'break-word' }}>
        <Card.Description
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Unequip
            collectibleId={collectibleId}
            getCollectibles={getCollectibles}
            getEquippedCollectibles={getEquippedCollectibles}
            getSignInfo={getSignInfo}
          ></Unequip>
          <Image
            src={require(`../../assets/items/${getImage(collectibleId)}`)}
            style={{ height: '80px' }}
          ></Image>
        </Card.Description>
      </Card.Content>
    </Item>
  )
}
