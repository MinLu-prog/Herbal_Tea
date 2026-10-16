import { useEffect, useState } from 'react'
import { Leaf, Server } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card'

function App() {
  const [message, setMessage] = useState('Connecting to the Express API...')

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API request failed')
        return response.json()
      })
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('The Express API is not available yet.'))
  }, [])

  return (
    <main className="shell">
      <Card>
        <CardHeader>
          <div className="brand-mark" aria-label="Herbal logo">
            <Leaf size={24} strokeWidth={2.4} aria-hidden="true" />
          </div>
          <p className="eyebrow">React + Node + Express</p>
          <CardTitle>Welcome to Herbal.</CardTitle>
          <CardDescription>
            Your full-stack starter is ready. Build the interface in React and
            add API endpoints in Express.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="status">
            <span className="status-icon" aria-hidden="true">
              <Server size={16} />
            </span>
            <span>{message}</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
