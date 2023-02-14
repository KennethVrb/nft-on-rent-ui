import { Card } from 'semantic-ui-react'

export default function Item({ style, children }) {
  return (
    <Card
      style={{
        backgroundColor: '#8b8b8b',
        boxShadow: 'inset 0.2rem 0.2rem black, 0.2rem 0.2rem white',
        minHeight: '200px',
        ...style,
      }}
    >
      {children}
    </Card>
  )
}
