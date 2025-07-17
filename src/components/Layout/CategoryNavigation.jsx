import { motion } from 'framer-motion'
import './CategoryNavigation.css'

const CategoryNavigation = ({ categories, onCategorySelect }) => {
  return (
    <div className="category-navigation">
      <motion.div 
        className="categories-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p>Hangi kategoriden araç seçmek istiyorsunuz?</p>
      </motion.div>

      <motion.div 
        className="categories-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            className="category-card"
            onClick={() => onCategorySelect(category.id)}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1 + 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <div className="category-icon">
              {category.icon}
            </div>
            <h3 className="category-title">
              {category.label}
            </h3>
            <div className="category-arrow">
              →
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

export default CategoryNavigation 