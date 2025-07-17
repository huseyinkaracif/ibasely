import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import './BackButton.css'

const BackButton = ({ onClick }) => {
  return (
    <motion.button
      className="back-button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ChevronLeft size={20} />
      <span>Geri</span>
    </motion.button>
  )
}

export default BackButton 