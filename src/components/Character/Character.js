import { web3FromSource } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'
import { Grid } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import Inventory from '../Inventory'
import Loadout from '../Loadout'
import RentableItems from '../RentableItems'

export default function Character() {
  const { api, currentAccount } = useSubstrateState()
  const [collectibles, setCollectibles] = useState([])
  const [equippedCollectibles, setEquippedCollectibles] = useState([])
  const [blockNumber, setBlockNumber] = useState(0)

  const getCollectibles = async () => {
    const result = await api.query.palletRent.collectibles.entries()
    if (result.isEmpty) return
    const collectibles = result.map(result => result[1].toJSON())
    setCollectibles(collectibles)
  }

  const getEquippedCollectibles = async () => {
    const result = await api.query.palletRent.accountEquips(
      currentAccount.address
    )

    if (result.isEmpty) {
      setEquippedCollectibles([])
      return
    }

    setEquippedCollectibles(result.toJSON())
  }

  const getSignInfo = async () => {
    const {
      address,
      meta: { source, isInjected },
    } = currentAccount

    if (!isInjected) {
      return [currentAccount]
    }

    const injector = await web3FromSource(source)
    return [address, { signer: injector.signer }]
  }

  // Get all collectibles
  useEffect(() => {
    if (currentAccount && blockNumber) {
      getCollectibles()
      getEquippedCollectibles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, blockNumber])

  // Continuously update the block number.
  // Block number is used to keep everything else up to date
  useEffect(() => {
    let unsubscribeAll = null

    api.derive.chain
      .bestNumberFinalized(number => setBlockNumber(number.toNumber()))
      .then(unsub => {
        unsubscribeAll = unsub
      })
      .catch(console.error)

    return () => unsubscribeAll && unsubscribeAll()
  }, [api.derive.chain])

  return (
    <div
      style={{
        backgroundColor: '#c6c6c6',
        boxShadow: 'inset 0.2rem 0.2rem #fff, 0.2rem 0.2rem black',
        padding: '10px',
        paddingBottom: '30px',
        border: '2px solid black',
      }}
    >
      <Grid.Row>
        <Loadout
          equippedCollectibles={equippedCollectibles}
          getCollectibles={getCollectibles}
          getEquippedCollectibles={getEquippedCollectibles}
          getSignInfo={getSignInfo}
        ></Loadout>
      </Grid.Row>
      <Grid.Row style={{ marginTop: '2rem' }}>
        <Inventory
          collectibles={collectibles}
          getCollectibles={getCollectibles}
          equippedCollectibles={equippedCollectibles}
          getEquippedCollectibles={getEquippedCollectibles}
          getSignInfo={getSignInfo}
        ></Inventory>
      </Grid.Row>
      <Grid.Row style={{ marginTop: '2rem' }}>
        <RentableItems
          getCollectibles={getCollectibles}
          blockNumber={blockNumber}
          getSignInfo={getSignInfo}
        ></RentableItems>
      </Grid.Row>
    </div>
  )
}
