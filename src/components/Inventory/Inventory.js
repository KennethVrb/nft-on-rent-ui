import { useEffect, useState } from 'react'
import { Button, Container, Grid } from 'semantic-ui-react'

import { useSubstrateState } from '../../substrate-lib'

import Item from './Item'

import './styles.css'

export default function Inventory() {
  const { api, currentAccount } = useSubstrateState()
  const [collectables, setAllCollectables] = useState([])
  const [items, setItems] = useState([])

  const getCollectables = async () => {
    api.query.nftOnRent.collectibleMap.entries(result => {
      if (result.isEmpty) return
      const collectables = result.map(collectableResult =>
        JSON.parse(collectableResult[1].toString())
      )
      setAllCollectables(collectables)
    })
  }

  const setInventory = () => {
    setItems(
      collectables
        .filter(collectable => collectable.lessor === currentAccount.address)
        .map(collectable => (
          <Item key={collectable.uniqueId} item={collectable}></Item>
        ))
    )
  }

  useEffect(() => {
    currentAccount && getCollectables()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => !!collectables.length && setInventory(), [collectables])

  return (
    <Grid.Column width={16}>
      <h2 className="inventory-title">
        Inventory{' '}
        <div>
          <Button>Create Item</Button>
          <Button onClick={setInventory}>Refresh</Button>
        </div>
      </h2>
      <Container>
        <Grid columns={4}>{items}</Grid>
      </Container>
    </Grid.Column>
  )
}
