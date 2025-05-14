import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import getIcon from "../utils/iconUtils";

function NotFound() {
  const navigate = useNavigate();
  const ArrowLeftIcon = getIcon("ArrowLeft");
  const AlertCircleIcon = getIcon("AlertCircle");
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-surface-50 dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md">
        <motion.div 
          className="text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <AlertCircleIcon className="text-primary-dark dark:text-primary-light" size={48} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-800 dark:text-surface-100 mb-4">
            404
          </h1>
          
          <h2 className="text-xl md:text-2xl font-medium text-surface-700 dark:text-surface-300 mb-2">
            Page Not Found
          </h2>
          
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
          
          <motion.button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-5 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeftIcon className="mr-2" size={18} />
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default NotFound;