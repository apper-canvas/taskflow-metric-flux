import { useState } from "react";
import { motion } from "framer-motion";
import MainFeature from "../components/MainFeature";
import getIcon from "../utils/iconUtils";

function Home() {
  const CheckCircleIcon = getIcon("CheckCircle");
  const CheckSquareIcon = getIcon("CheckSquare");
  const LayoutDashboardIcon = getIcon("LayoutDashboard");
  
  const [activeView, setActiveView] = useState("tasks");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <header className="py-4 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <motion.div variants={itemVariants} className="mb-4 md:mb-0">
              <div className="flex items-center">
                <CheckCircleIcon className="mr-2" size={28} />
                <h1 className="text-2xl md:text-3xl font-bold">TaskFlow</h1>
              </div>
              <p className="text-sm md:text-base mt-1 text-white/80">
                Organize your tasks efficiently
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex space-x-2">
              <button
                onClick={() => setActiveView("tasks")}
                className={`px-3 py-2 rounded-lg flex items-center text-sm md:text-base transition-all ${
                  activeView === "tasks" 
                    ? "bg-white text-primary font-medium" 
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <CheckSquareIcon className="mr-1.5" size={18} />
                <span>Tasks</span>
              </button>
              
              <button
                onClick={() => setActiveView("dashboard")}
                className={`px-3 py-2 rounded-lg flex items-center text-sm md:text-base transition-all ${
                  activeView === "dashboard" 
                    ? "bg-white text-primary font-medium" 
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <LayoutDashboardIcon className="mr-1.5" size={18} />
                <span>Dashboard</span>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        <motion.div variants={itemVariants}>
          <MainFeature activeView={activeView} />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 px-4 md:px-8 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
        <div className="container mx-auto">
          <motion.div 
            variants={itemVariants}
            className="text-center text-surface-500 dark:text-surface-400 text-sm"
          >
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </motion.div>
  );
}

export default Home;