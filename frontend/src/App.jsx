import SlotPicker from './pages/SlotPicker.jsx'
import { createMockApi } from './api/client.js'

const mockApi = createMockApi()

// Supports: FR-BKG-01, FR-BKG-06
export default function App() {
  return <SlotPicker client={mockApi} />
}
