import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from '@/app/providers/StoreProvider'
import { AppRouter } from '@/app/router/AppRouter'

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
