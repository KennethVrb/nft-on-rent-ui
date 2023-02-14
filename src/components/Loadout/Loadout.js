import { Button, Card, Grid, Icon, Image } from 'semantic-ui-react'
import { createRandomId } from '../../utils'
import Item from '../Item'

export default function Loadout({
  equippedCollectibles,
  getEquipedCollectibes,
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
          <Button secondary icon onClick={getEquipedCollectibes}>
            <Icon name="refresh" />
          </Button>
        </div>
      </h2>
      <Grid columns={4} centered stretched>
        <Grid.Column style={{ width: '130px' }}>
          <Grid columns={1} stretched>
            {getItems().map(collectible => {
              return (
                <Grid.Column key={collectible.uniqueId}>
                  {collectible.isPlaceholder ? (
                    <Item
                      style={{
                        width: '100px',
                        height: '100px',
                        minHeight: '100px',
                      }}
                    ></Item>
                  ) : (
                    <Item
                      style={{
                        width: '100px',
                        height: '100px',
                        minHeight: '100px',
                      }}
                    >
                      <Card.Content style={{ wordWrap: 'break-word' }}>
                        <Card.Description>
                          {collectible.uniqueId}
                        </Card.Description>
                      </Card.Content>
                    </Item>
                  )}
                </Grid.Column>
              )
            })}
          </Grid>
        </Grid.Column>
        <Grid.Column>
          <Image src={`${process.env.PUBLIC_URL}/assets/character.png`} />
        </Grid.Column>
      </Grid>
    </Grid.Column>
  )
}
