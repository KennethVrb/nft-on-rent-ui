import { useEffect, useState } from 'react'
import { Button, Container, Grid, Icon } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

import InventoryItem from './InventoryItem'
import CreateItem from './CreateItem'

import './styles.css'

export default function Inventory({
  collectibles,
  getCollectibles,
  equippedCollectibles,
  getEquippedCollectibles,
  getSignInfo,
}) {
  const { api, currentAccount } = useSubstrateState()
  const [ownedCollectibles, setOwnedCollectibles] = useState([])
  const [rentedCollectibles, setRentedCollectibles] = useState([])

  const getRentedCollectibles = async () => {
    setRentedCollectibles(
      await Promise.all(
        collectibles
          .filter(collectible => collectible.lessee === currentAccount.address)
          .map(async collectible => {
            const result = await api.query.palletRent.lesseeCollectibles(
              currentAccount.address,
              collectible.uniqueId
            )
            const lesseeCollectible = JSON.parse(result.toString())
            return { ...collectible, ...lesseeCollectible }
          })
      )
    )
  }

  useEffect(() => {
    if (!collectibles.length) return

    // Set owned collectibles
    setOwnedCollectibles(
      collectibles.filter(
        collectible => collectible.lessor === currentAccount.address
      )
    )

    getRentedCollectibles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectibles])

  return (
    <Grid.Column width={16}>
      <h2 className="inventory-title">
        Inventory{' '}
        <div>
          <CreateItem
            getCollectibles={getCollectibles}
            getSignInfo={getSignInfo}
          ></CreateItem>
          <Button secondary icon onClick={getCollectibles}>
            <Icon name="refresh" />
          </Button>
        </div>
      </h2>
      <Container>
        <Grid columns={4}>
          {[...ownedCollectibles, ...rentedCollectibles].map(collectible => (
            <InventoryItem
              key={collectible.uniqueId}
              collectible={collectible}
              getCollectibles={getCollectibles}
              equippedCollectibles={equippedCollectibles}
              getEquippedCollectibles={getEquippedCollectibles}
              getSignInfo={getSignInfo}
              rented={collectible.lessee === currentAccount.address}
            ></InventoryItem>
          ))}
        </Grid>
      </Container>
    </Grid.Column>
  )
}
