import { createContext, useState } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const LoaderContext = createContext({})

const LoaderProvider = ({ children }) => {
  const [message, setMessage] = useState(null)

  return (
    <LoaderContext.Provider
      value={{
        message,
        showLoader: message => setMessage(message),
        hideLoader: () => setMessage(null),
      }}
    >
      {children}
      {!!message && (
        <Dimmer active style={{ position: 'fixed', opacity: '0.5' }}>
          <Loader size="massive">{message}</Loader>
        </Dimmer>
      )}
    </LoaderContext.Provider>
  )
}

export { LoaderContext, LoaderProvider }
