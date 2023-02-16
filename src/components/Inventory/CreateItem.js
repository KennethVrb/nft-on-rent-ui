import { useContext } from 'react'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../../substrate-lib'
import { LoaderContext } from '../contexts'

export default function CreateItem({ getCollectibles, getSignInfo }) {
  const { api } = useSubstrateState()

  const { showLoader, hideLoader } = useContext(LoaderContext)

  const onCreateItem = async () => {
    showLoader('Creating item...')

    const signInfo = await getSignInfo()

    api.tx.palletRent
      .mint()
      .signAndSend(...signInfo, ({ status }) => {
        if (status.isInBlock) {
          getCollectibles()
          hideLoader(null)
        }
      })
      .catch(e => {
        console.log(e)
        hideLoader(null)
      })
  }

  return (
    <Button primary onClick={onCreateItem}>
      Create Item
    </Button>
  )
}
