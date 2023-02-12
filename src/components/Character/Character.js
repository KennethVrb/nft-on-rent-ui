import { web3FromSource } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'
import { Grid } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import Inventory from '../Inventory'

export default function Character() {
  const { api, currentAccount } = useSubstrateState()
  const [collectibles, setCollectibles] = useState([])
  const [equippedCollectibles, setEquippedCollectibles] = useState([])
  const [blockNumber, setBlockNumber] = useState(0)

  const getCollectibles = async () => {
    const result = await api.query.palletRent.collectibles.entries()
    if (result.isEmpty) return
    const colectibles = result.map(collectableResult =>
      JSON.parse(collectableResult[1].toString())
    )
    setCollectibles(colectibles)
  }

  const getEquippedCollectibles = async () => {
    const result = await api.query.palletRent.accountEquips(
      currentAccount.address
    )

    if (result.isEmpty) return

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
  // Block numer is used to keep everything else up to date
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
    <Grid.Column width={16}>
      <Grid.Row>
        <Grid.Column width={16}>
          <Inventory
            collectibles={collectibles}
            getCollectibles={getCollectibles}
            equippedCollectibles={equippedCollectibles}
            getEquippedCollectibles={getEquippedCollectibles}
            getSignInfo={getSignInfo}
          ></Inventory>
        </Grid.Column>
      </Grid.Row>
    </Grid.Column>
  )
}
