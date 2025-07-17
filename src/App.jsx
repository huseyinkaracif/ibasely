import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Layout/Header'
import TabNavigation from './components/Layout/TabNavigation'
import QRGenerator from './components/QRGenerator/QRGenerator'
import BatchQRGenerator from './components/QRGenerator/BatchQRGenerator'

const tabs = [
  {
    id: 'qr-generator',
    label: 'QR Oluştur',
    icon: '📱',
    component: QRGenerator
  },
  {
    id: 'batch-qr-generator',
    label: 'Toplu QR Oluştur',
    icon: '📋',
    component: BatchQRGenerator
  }
]

function App() {
  const [activeTab, setActiveTab] = useState('qr-generator')

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default App 