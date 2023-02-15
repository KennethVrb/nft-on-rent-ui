import { useEffect, useState } from 'react'
import { Button, Grid, Icon, Popup } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { createRandomId } from '../../utils'
import Item from '../Item'
import RentableItem from './RentableItem'

export default function RentableItems({ getCollectibles, getSignInfo }) {
  const { api, currentAccount } = useSubstrateState()
  const [rentableCollectibles, setRentableCollectibles] = useState([])

  const getRentableCollectibles = () => {
    api.query.palletRent.rentableCollectibles(async result => {
      const rentableCollectibleIds = result.toJSON()
      let rentableCollectibles = await Promise.all(
        rentableCollectibleIds.map(async collectibleId => {
          const collectible = await api.query.palletRent.collectibles(
            collectibleId
          )
          return collectible.toJSON()
        })
      )

      rentableCollectibles = rentableCollectibles.filter(
        collectible =>
          collectible.lessor !== currentAccount.address && !collectible.lessee
      )
      const emptyItemCount = 4 - rentableCollectibles.length
      for (let i = 0; i < emptyItemCount; i++) {
        rentableCollectibles.push({
          uniqueId: createRandomId(),
          isPlaceholder: true,
        })
      }
      setRentableCollectibles(rentableCollectibles)
    })
  }

  useEffect(
    () => !!currentAccount && getRentableCollectibles(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAccount]
  )

  return (
    <Grid.Column width={16}>
      <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
        Rentable Items{' '}
        <Popup
          content="Refresh"
          trigger={
            <Button secondary icon onClick={getRentableCollectibles}>
              <Icon name="refresh" />
            </Button>
          }
        ></Popup>
      </h2>
      <Grid columns={4} stretched>
        {rentableCollectibles.map(collectible => {
          return (
            <Grid.Column key={collectible.uniqueId}>
              {collectible.isPlaceholder ? (
                <Item></Item>
              ) : (
                <RentableItem
                  collectible={collectible}
                  getRentedCollectibles={getRentableCollectibles}
                  getCollectibles={getCollectibles}
                  getSignInfo={getSignInfo}
                ></RentableItem>
              )}
            </Grid.Column>
          )
        })}
      </Grid>
    </Grid.Column>
  )
}
