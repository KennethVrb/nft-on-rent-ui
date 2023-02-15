import { useEffect, useState } from 'react'
import { Button, Grid, Icon, Popup } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'

import InventoryItem from './InventoryItem'
import CreateItem from './CreateItem'

import './styles.css'
import { createRandomId } from '../../utils'
import Item from '../Item'

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
  const [rentedOutCollectibles, setRentedOutCollectibles] = useState([])

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

  const getRentedOutCollectibles = async () => {
    const rentedOutCollectibles = collectibles.filter(
      collectible =>
        collectible.lessor === currentAccount.address && collectible.lessee
    )

    if (rentedOutCollectibles.length) {
      setRentedOutCollectibles(
        await Promise.all(
          rentedOutCollectibles.map(async collectible => {
            const result = await api.query.palletRent.lesseeCollectibles(
              collectible.lessee,
              collectible.uniqueId
            )
            const lesseeCollectible = result.toJSON()
            return { ...lesseeCollectible, uniqueId: collectible.uniqueId }
          })
        )
      )
    } else {
      setRentedOutCollectibles([])
    }
  }

  const getAllItems = () => {
    const items = [...ownedCollectibles, ...rentedCollectibles]
    const emptyItemCount = 8 - items.length
    for (let i = 0; i < emptyItemCount; i++) {
      items.push({
        uniqueId: createRandomId(),
        isPlaceholder: true,
      })
    }

    return items
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
    getRentedOutCollectibles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectibles])

  useEffect(() => {
    if (currentAccount) {
      setOwnedCollectibles([])
      setRentedCollectibles([])
      setRentedOutCollectibles([])
    }
  }, [currentAccount])

  return (
    <Grid.Column width={16}>
      <h2 className="inventory-title">
        Inventory{' '}
        <div>
          <CreateItem
            getCollectibles={getCollectibles}
            getSignInfo={getSignInfo}
          ></CreateItem>
          <Popup
            content="Refresh"
            trigger={
              <Button secondary icon onClick={getCollectibles}>
                <Icon name="refresh" />
              </Button>
            }
          ></Popup>
        </div>
      </h2>

      <Grid columns={4} stretched>
        {getAllItems().map(collectible => (
          <Grid.Column key={collectible.uniqueId}>
            {collectible.isPlaceholder ? (
              <Item></Item>
            ) : (
              <InventoryItem
                collectible={collectible}
                rentedOutCollectible={rentedOutCollectibles.find(
                  rentedOutCollectible =>
                    rentedOutCollectible.uniqueId === collectible.uniqueId
                )}
                getCollectibles={getCollectibles}
                equippedCollectibles={equippedCollectibles}
                getEquippedCollectibles={getEquippedCollectibles}
                getSignInfo={getSignInfo}
                rented={collectible.lessee === currentAccount.address}
              ></InventoryItem>
            )}
          </Grid.Column>
        ))}
      </Grid>
    </Grid.Column>
  )
}
