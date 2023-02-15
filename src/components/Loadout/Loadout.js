import { Button, Grid, Icon, Image, Popup } from 'semantic-ui-react'
import { createRandomId } from '../../utils'
import Item from '../Item'
import EquippedItem from './EquippedItem'

export default function Loadout({
  equippedCollectibles,
  getCollectibes,
  getEquippedCollectibles,
  getSignInfo,
}) {
  const getItems = () => {
    const items = equippedCollectibles.map(collectible => {
      return {
        uniqueId: collectible,
        isPlaceholder: false,
      }
    })
    const emptyItemCount = 4 - items.length
    for (let i = 0; i < emptyItemCount; i++) {
      items.push({
        uniqueId: createRandomId(),
        isPlaceholder: true,
      })
    }

    return items
  }
  return (
    <Grid.Column width={16}>
      <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
        Loadout{' '}
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
            {getItems().map(collectible => {
              return (
                <Grid.Column
                  key={collectible.uniqueId}
                  style={{ height: '130px !important' }}
                >
                  {collectible.isPlaceholder ? (
                    <Item
                      style={{
                        width: '100px',
                        height: '100px',
                        minHeight: '100px',
                      }}
                    ></Item>
                  ) : (
                    <EquippedItem
                      style={{
                        width: '100px',
                        height: '100px',
                        minHeight: '100px',
                      }}
                      collectible={collectible}
                      getCollectibles={getCollectibes}
                      getEquippedCollectibles={getEquippedCollectibles}
                      getSignInfo={getSignInfo}
                    ></EquippedItem>
                  )}
                </Grid.Column>
              )
            })}
          </Grid>
        </Grid.Column>
        <Grid.Column style={{ width: '300px' }}>
          <Image src={require(`../../assets/character.png`)} />
        </Grid.Column>
        <Grid.Column style={{ width: '130px' }}>
          <Grid columns={1} stretched>
            <Grid.Column style={{ height: '130px' }}></Grid.Column>
            <Grid.Column style={{ height: '130px' }}>
              <Item
                style={{
                  width: '100px',
                  height: '100px',
                  minHeight: '100px',
                }}
              ></Item>
            </Grid.Column>
            <Grid.Column style={{ height: '130px' }}>
              <Item
                style={{
                  width: '100px',
                  height: '100px',
                  minHeight: '100px',
                }}
              ></Item>
            </Grid.Column>
            <Grid.Column style={{ height: '130px' }}></Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </Grid.Column>
  )
}
