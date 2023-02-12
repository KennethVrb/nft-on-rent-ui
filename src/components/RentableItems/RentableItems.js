import { useEffect, useState } from 'react'
import { Button, Grid, Icon } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import Item from './Item'

export default function RentableItems({
  blockNumber,
  getCollectibles,
  getSignInfo,
}) {
  const { api, currentAccount } = useSubstrateState()
  const [rentableCollectibles, setRentableCollectibles] = useState([])

  const getRentableCollectibles = () => {
    api.query.palletRent.rentableCollectibles(async result => {
      const rentableCollectibleIds = result.toJSON()
      const newCollectibles = await Promise.all(
        rentableCollectibleIds.map(async collectibleId => {
          const collectible = await api.query.palletRent.collectibles(
            collectibleId
          )
          return collectible.toJSON()
        })
      )
      setRentableCollectibles(newCollectibles)
    })
  }

  useEffect(
    () => !!currentAccount && getRentableCollectibles(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAccount, blockNumber]
  )

  return (
    <Grid.Column width={16}>
      <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
        Rentable Items{' '}
        <Button secondary icon onClick={getRentableCollectibles}>
          <Icon name="refresh" />
        </Button>
      </h2>
      <Grid columns={4} stretched>
        {rentableCollectibles
          .filter(
            collectible =>
              collectible.lessor !== currentAccount.address &&
              collectible.lessee !== currentAccount.address
          )
          .map(collectible => (
            <Grid.Column key={collectible.uniqueId}>
              <Item
                collectible={collectible}
                getRentedCollectibles={getRentableCollectibles}
                getCollectibles={getCollectibles}
                getSignInfo={getSignInfo}
              ></Item>
            </Grid.Column>
          ))}
      </Grid>
    </Grid.Column>
  )
}
