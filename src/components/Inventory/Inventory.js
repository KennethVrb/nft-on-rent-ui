import { web3FromSource } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'
import { Button, Container, Grid, Icon } from 'semantic-ui-react'

import { useSubstrateState } from '../../substrate-lib'

import InventoryItem from './InventoryItem'
import CreateItem from './CreateItem'

import './styles.css'

export default function Inventory() {
  const { api, currentAccount } = useSubstrateState()
  const [allCollectables, setAllCollectables] = useState([])
  const [ownedCollectables, setOwnedCollectables] = useState([])
  const [rentedCollectables, setRentedCollectables] = useState([])
  const [equippedCollectables, setEquippedCollectables] = useState([])
  const [blockNumber, setBlockNumber] = useState(0)

  const getCollectables = async () => {
    const result = await api.query.palletRent.collectibles.entries()
    if (result.isEmpty) return
    const collectables = result.map(collectableResult =>
      JSON.parse(collectableResult[1].toString())
    )
    setAllCollectables(collectables)
  }

  const getRentedCollectables = async () => {
    setRentedCollectables(
      await Promise.all(
        allCollectables
          .filter(collectable => collectable.lessee === currentAccount.address)
          .map(async collectable => {
            const result = await api.query.palletRent.lesseeCollectibles(
              currentAccount.address,
              collectable.uniqueId
            )
            const lesseeCollectible = JSON.parse(result.toString())
            return { ...collectable, ...lesseeCollectible }
          })
      )
    )
  }

  const getEquipedCollectables = async () => {
    const result = await api.query.palletRent.accountEquips(
      currentAccount.address
    )
    if (result.isEmpty) return
    const equippedCollectableIds = JSON.parse(result.toString())
    setEquippedCollectables(
      equippedCollectableIds.map(id =>
        [...ownedCollectables, ...rentedCollectables].find(
          collectable => collectable.uniqueId === id
        )
      )
    )
  }

  const getSignInfo = async () => {
    const {
      address,
      meta: { source, isInjected },
    } = currentAccount

    if (!isInjected) {
      return [currentAccount]
    }

    // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
    // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
    const injector = await web3FromSource(source)
    return [address, { signer: injector.signer }]
  }

  useEffect(() => {
    currentAccount && getCollectables()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (!allCollectables.length) return

    // Get owned collectables
    setOwnedCollectables(
      allCollectables.filter(
        collectable => collectable.lessor === currentAccount.address
      )
    )

    getRentedCollectables()
    getEquipedCollectables()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCollectables, currentAccount, api, blockNumber])

  useEffect(() => {
    let unsubscribeAll = null

    api.derive.chain
      .bestNumberFinalized(number => {
        setBlockNumber(number.toNumber().toLocaleString('en-US'))
      })
      .then(unsub => {
        unsubscribeAll = unsub
      })
      .catch(console.error)

    return () => unsubscribeAll && unsubscribeAll()
  }, [api.derive.chain])
  console.log('ownedCollectables', ownedCollectables)
  return (
    <Grid.Column width={16}>
      <h2 className="inventory-title">
        Inventory{' '}
        <div>
          <CreateItem
            getCollectables={getCollectables}
            getSignInfo={getSignInfo}
          ></CreateItem>
          <Button secondary icon onClick={getCollectables}>
            <Icon name="refresh" />
          </Button>
        </div>
      </h2>
      <Container>
        <Grid columns={3} stretched>
          {ownedCollectables.map(collectable => (
            <InventoryItem
              key={collectable.uniqueId}
              collectable={collectable}
              getCollectables={getCollectables}
              getSignInfo={getSignInfo}
              equippedCollectables={equippedCollectables}
            ></InventoryItem>
          ))}
          {rentedCollectables.map(collectable => (
            <InventoryItem
              key={collectable.uniqueId}
              collectable={collectable}
              getCollectables={getCollectables}
              getSignInfo={getSignInfo}
              equippedCollectables={equippedCollectables}
              rented={true}
            ></InventoryItem>
          ))}
        </Grid>
      </Container>
    </Grid.Column>
  )
}
