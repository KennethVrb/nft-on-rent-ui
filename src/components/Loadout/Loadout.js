import { Button, Grid, Icon, Image, Popup } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { getImage } from '../../utils'
import Item from '../Item'
import EquippedItem from './EquippedItem'

export default function Loadout({
  equippedCollectibles,
  getCollectibles,
  getEquippedCollectibles,
  getSignInfo,
}) {
  const { currentAccount } = useSubstrateState()
  const getItemForType = type => {
    const collectibleId = equippedCollectibles.find(collectible => {
      const image = getImage(collectible)
      return image.includes(type)
    })
    if (collectibleId) {
      return collectibleId
    }
    return null
  }

  return (
    <Grid.Column width={16}>
      <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Loadout</span>
        <span>{!!currentAccount && currentAccount.meta.name}</span>
        <div>
          <Popup
            content="Trigger"
            trigger={
              <Button secondary icon onClick={getEquippedCollectibles}>
                <Icon name="refresh" />
              </Button>
            }
          ></Popup>
        </div>
      </h2>
      <Grid columns={5} centered stretched>
        <Grid.Column style={{ width: '130px' }}>
          <Grid columns={1} stretched>
            <Grid.Column>
              {getItemForType('helmet') ? (
                <EquippedItem
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                  collectibleId={getItemForType('helmet')}
                  getCollectibles={getCollectibles}
                  getEquippedCollectibles={getEquippedCollectibles}
                  getSignInfo={getSignInfo}
                ></EquippedItem>
              ) : (
                <Item
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                ></Item>
              )}
            </Grid.Column>
            <Grid.Column>
              {getItemForType('chestplate') ? (
                <EquippedItem
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                  collectibleId={getItemForType('chestplate')}
                  getCollectibles={getCollectibles}
                  getEquippedCollectibles={getEquippedCollectibles}
                  getSignInfo={getSignInfo}
                ></EquippedItem>
              ) : (
                <Item
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                ></Item>
              )}
            </Grid.Column>
            <Grid.Column>
              {getItemForType('leggings') ? (
                <EquippedItem
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                  collectibleId={getItemForType('leggings')}
                  getCollectibles={getCollectibles}
                  getEquippedCollectibles={getEquippedCollectibles}
                  getSignInfo={getSignInfo}
                ></EquippedItem>
              ) : (
                <Item
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                ></Item>
              )}
            </Grid.Column>
            <Grid.Column>
              {getItemForType('boots') ? (
                <EquippedItem
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                  collectibleId={getItemForType('boots')}
                  getCollectibles={getCollectibles}
                  getEquippedCollectibles={getEquippedCollectibles}
                  getSignInfo={getSignInfo}
                ></EquippedItem>
              ) : (
                <Item
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                ></Item>
              )}
            </Grid.Column>
          </Grid>
        </Grid.Column>
        <Grid.Column style={{ width: '300px' }}>
          <Image src={require(`../../assets/character.png`)} />
        </Grid.Column>
        <Grid.Column style={{ width: '130px' }}>
          <Grid columns={1} stretched>
            <Grid.Column style={{ height: '130px' }}></Grid.Column>
            <Grid.Column>
              {getItemForType('weapon') ? (
                <EquippedItem
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                  collectibleId={getItemForType('weapon')}
                  getCollectibles={getCollectibles}
                  getEquippedCollectibles={getEquippedCollectibles}
                  getSignInfo={getSignInfo}
                ></EquippedItem>
              ) : (
                <Item
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                ></Item>
              )}
            </Grid.Column>
            <Grid.Column>
              {getItemForType('shield') ? (
                <EquippedItem
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                  collectibleId={getItemForType('shield')}
                  getCollectibles={getCollectibles}
                  getEquippedCollectibles={getEquippedCollectibles}
                  getSignInfo={getSignInfo}
                ></EquippedItem>
              ) : (
                <Item
                  style={{
                    width: '100px',
                    height: '100px',
                    minHeight: '100px',
                  }}
                ></Item>
              )}
            </Grid.Column>
            <Grid.Column style={{ height: '130px' }}></Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </Grid.Column>
  )
}
