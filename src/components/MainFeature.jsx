import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import getIcon from "../utils/iconUtils";

function MainFeature({ activeView }) {
  // Icon definitions
  const PlusIcon = getIcon("Plus");
  const CheckIcon = getIcon("Check");
  const ClockIcon = getIcon("Clock");
  const TrashIcon = getIcon("Trash");
  const PencilIcon = getIcon("Pencil");
  const FilterIcon = getIcon("Filter");
  const XIcon = getIcon("X");
  const FolderIcon = getIcon("Folder");
  const TagIcon = getIcon("Tag");
  const AlertTriangleIcon = getIcon("AlertTriangle");
  const CircleIcon = getIcon("Circle");
  const ChevronDownIcon = getIcon("ChevronDown");

  // States
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: "1",
        title: "Create task board design",
        description: "Design the UI for the task board with drag and drop functionality",
        status: "In Progress",
        priority: "High",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        tags: ["Design", "UI/UX"]
      },
      {
        id: "2",
        title: "Implement task filtering",
        description: "Add ability to filter tasks by status, priority, and tags",
        status: "To Do",
        priority: "Medium",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        tags: ["Development"]
      },
      {
        id: "3",
        title: "Fix mobile responsiveness",
        description: "Address issues with mobile layout in the dashboard view",
        status: "Done",
        priority: "High",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        tags: ["Bug", "Mobile"]
      }
    ];
  });

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  
  const [newTask, setNewTask] = useState({
    id: "",
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
    createdAt: "",
    tags: []
  });
  
  const [newTagInput, setNewTagInput] = useState("");
  
  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === "All") return true;
    if (filter === "To Do" || filter === "In Progress" || filter === "Done") {
      return task.status === filter;
    }
    if (filter === "High" || filter === "Medium" || filter === "Low") {
      return task.priority === filter;
    }
    return true;
  });
  
  // Task Statistics
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "To Do").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    done: tasks.filter(t => t.status === "Done").length,
    highPriority: tasks.filter(t => t.priority === "High").length
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask ? 
          { ...newTask, updatedAt: new Date().toISOString() } : 
          task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully");
    } else {
      // Add new task
      const taskWithId = { 
        ...newTask, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks([...tasks, taskWithId]);
      toast.success("Task added successfully");
    }
    
    // Reset form
    setNewTask({
      id: "",
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      createdAt: "",
      tags: []
    });
    setNewTagInput("");
    setEditingTask(null);
    setShowNewTaskModal(false);
  };
  
  // Edit a task
  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setNewTask({...task});
    setShowNewTaskModal(true);
  };
  
  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };
  
  // Toggle task status
  const handleToggleStatus = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "Done" ? "To Do" : 
                         task.status === "To Do" ? "In Progress" : "Done";
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    const currentTask = tasks.find(t => t.id === taskId);
    const newStatus = currentTask.status === "Done" ? "To Do" : 
                     currentTask.status === "To Do" ? "In Progress" : "Done";
    toast.info(`Task marked as ${newStatus}`);
  };
  
  // Tags management
  const handleAddTag = () => {
    if (newTagInput.trim() && !newTask.tags.includes(newTagInput.trim())) {
      setNewTask({...newTask, tags: [...newTask.tags, newTagInput.trim()]});
      setNewTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "text-red-500 dark:text-red-400";
      case "Medium": return "text-yellow-500 dark:text-yellow-400";
      case "Low": return "text-green-500 dark:text-green-400";
      default: return "text-surface-500";
    }
  };
  
  // Get background color based on status
  const getStatusBgColor = (status) => {
    switch(status) {
      case "To Do": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "In Progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Done": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200";
    }
  };
  
  // Get tag color
  const getTagColor = (tag) => {
    const colors = {
      "Design": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Development": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Bug": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "Feature": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "UI/UX": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      "Mobile": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    };
    
    return colors[tag] || "bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200";
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="relative">
      {/* Task Dashboard or List based on activeView */}
      {activeView === "dashboard" ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Task Summary Card */}
          <motion.div variants={itemVariants} className="card p-6 col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Task Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-surface-600 dark:text-surface-400">Total Tasks</span>
                <span className="font-semibold text-lg">{taskStats.total}</span>
              </div>
              
              <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-400 font-semibold text-lg">{taskStats.todo}</div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-400/70">To Do</div>
                </div>
                
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-lg">{taskStats.inProgress}</div>
                  <div className="text-xs text-yellow-600/70 dark:text-yellow-400/70">In Progress</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-semibold text-lg">{taskStats.done}</div>
                  <div className="text-xs text-green-600/70 dark:text-green-400/70">Completed</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Priority Breakdown */}
          <motion.div variants={itemVariants} className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Task Priorities</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-surface-600 dark:text-surface-400">High Priority</span>
                <span className="ml-auto font-semibold">{tasks.filter(t => t.priority === "High").length}</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-surface-600 dark:text-surface-400">Medium Priority</span>
                <span className="ml-auto font-semibold">{tasks.filter(t => t.priority === "Medium").length}</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-surface-600 dark:text-surface-400">Low Priority</span>
                <span className="ml-auto font-semibold">{tasks.filter(t => t.priority === "Low").length}</span>
              </div>
              
              <div className="w-full h-4 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mt-2 flex">
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${tasks.filter(t => t.priority === "High").length / tasks.length * 100}%` }}
                ></div>
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${tasks.filter(t => t.priority === "Medium").length / tasks.length * 100}%` }}
                ></div>
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${tasks.filter(t => t.priority === "Low").length / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
          
          {/* Recent Tasks */}
          <motion.div variants={itemVariants} className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            <div className="space-y-3">
              {tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).map(task => (
                <div key={task.id} className="flex items-start p-2 hover:bg-surface-100 dark:hover:bg-surface-700/50 rounded-lg transition-colors">
                  <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${
                    task.priority === "High" ? "bg-red-500" :
                    task.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                  } mr-2`}></div>
                  <div className="overflow-hidden">
                    <div className="font-medium text-surface-800 dark:text-surface-200 truncate">{task.title}</div>
                    <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center mt-1">
                      <ClockIcon size={12} className="mr-1" />
                      Added {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-6 text-surface-500 dark:text-surface-400">
                  <p>No tasks created yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div>
          {/* Task List Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
                My Tasks
              </h2>
              <p className="text-surface-500 dark:text-surface-400 mt-1">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} available
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className="btn btn-outline flex items-center w-full sm:w-auto"
                >
                  <FilterIcon size={16} className="mr-2" />
                  {filter}
                  <ChevronDownIcon size={16} className="ml-2" />
                </button>
                
                {filterDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 z-10"
                  >
                    <div className="py-1">
                      <button 
                        onClick={() => { setFilter("All"); setFilterDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        All
                      </button>
                      <div className="border-t border-surface-200 dark:border-surface-700 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-surface-500 dark:text-surface-400">
                        By Status
                      </div>
                      <button 
                        onClick={() => { setFilter("To Do"); setFilterDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        To Do
                      </button>
                      <button 
                        onClick={() => { setFilter("In Progress"); setFilterDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        In Progress
                      </button>
                      <button 
                        onClick={() => { setFilter("Done"); setFilterDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        Done
                      </button>
                      <div className="border-t border-surface-200 dark:border-surface-700 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-surface-500 dark:text-surface-400">
                        By Priority
                      </div>
                      <button 
                        onClick={() => { setFilter("High"); setFilterDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        High
                      </button>
                      <button 
                        onClick={() => { setFilter("Medium"); setFilterDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => { setFilter("Low"); setFilterDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        Low
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Add Task Button */}
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setNewTask({
                    id: "",
                    title: "",
                    description: "",
                    status: "To Do",
                    priority: "Medium",
                    dueDate: "",
                    createdAt: "",
                    tags: []
                  });
                  setShowNewTaskModal(true);
                }}
                className="btn btn-primary px-4 py-2.5 text-center flex items-center justify-center w-full sm:w-auto"
              >
                <PlusIcon size={18} className="mr-2" />
                Add Task
              </button>
            </div>
          </div>
          
          {/* Task List */}
          {filteredTasks.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredTasks.map((task) => (
                <motion.div 
                  key={task.id}
                  variants={itemVariants}
                  className="card-neu p-4 md:p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-grow">
                      <div className="flex items-start">
                        <button 
                          onClick={() => handleToggleStatus(task.id)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-1 ${
                            task.status === "Done" 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" 
                              : "bg-surface-200 text-surface-400 dark:bg-surface-700 dark:text-surface-400"
                          }`}
                        >
                          {task.status === "Done" && <CheckIcon size={12} />}
                        </button>
                        
                        <div className="flex-grow">
                          <h3 className={`font-medium text-lg ${
                            task.status === "Done" ? "line-through text-surface-500 dark:text-surface-400" : ""
                          }`}>
                            {task.title}
                          </h3>
                          
                          {task.description && (
                            <p className="text-surface-600 dark:text-surface-400 mt-1 text-sm">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBgColor(task.status)}`}>
                              {task.status}
                            </span>
                            
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center ${
                              task.priority === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" :
                              task.priority === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" :
                              "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            }`}>
                              <AlertTriangleIcon size={10} className="mr-1" />
                              {task.priority} Priority
                            </span>
                            
                            {task.dueDate && (
                              <span className="text-xs px-2.5 py-1 rounded-full bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300 font-medium flex items-center">
                                <ClockIcon size={10} className="mr-1" />
                                {format(new Date(task.dueDate), "MMM d, yyyy")}
                              </span>
                            )}
                            
                            {task.tags.map(tag => (
                              <span 
                                key={tag} 
                                className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center ${getTagColor(tag)}`}
                              >
                                <TagIcon size={10} className="mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 self-end md:self-center">
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="p-2 rounded-full text-surface-600 hover:text-primary hover:bg-surface-200 dark:text-surface-400 dark:hover:text-primary-light dark:hover:bg-surface-700 transition-colors"
                      >
                        <PencilIcon size={16} />
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-full text-surface-600 hover:text-red-500 hover:bg-red-50 dark:text-surface-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface-100 dark:bg-surface-800 rounded-lg p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center mx-auto mb-4">
                <FolderIcon className="text-surface-500 dark:text-surface-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">No tasks found</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                {filter === "All" 
                  ? "You don't have any tasks yet. Create your first task now!"
                  : `No ${filter} tasks found. Try a different filter or create a new task.`}
              </p>
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setNewTask({
                    id: "",
                    title: "",
                    description: "",
                    status: "To Do",
                    priority: "Medium",
                    dueDate: "",
                    createdAt: "",
                    tags: []
                  });
                  setShowNewTaskModal(true);
                }}
                className="btn btn-primary"
              >
                <PlusIcon size={16} className="mr-2" />
                Add Your First Task
              </button>
            </motion.div>
          )}
        </div>
      )}
      
      {/* New/Edit Task Modal */}
      <AnimatePresence>
        {showNewTaskModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
            <motion.div 
              className="w-full max-w-lg bg-white dark:bg-surface-800 rounded-xl shadow-lg"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
                <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-100">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h3>
                <button 
                  onClick={() => setShowNewTaskModal(false)}
                  className="p-2 rounded-full text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:hover:bg-surface-700"
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5">
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="label">Task Title <span className="text-red-500">*</span></label>
                    <input
                      id="title"
                      type="text"
                      className="input"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="label">Description</label>
                    <textarea
                      id="description"
                      className="input min-h-[100px]"
                      placeholder="Enter task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                  
                  {/* Status and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status */}
                    <div className="relative">
                      <label htmlFor="status" className="label">Status</label>
                      <button
                        type="button"
                        className="input flex items-center justify-between"
                        onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                      >
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                            newTask.status === "To Do" ? "bg-blue-500" :
                            newTask.status === "In Progress" ? "bg-yellow-500" : "bg-green-500"
                          }`}></span>
                          {newTask.status}
                        </div>
                        <ChevronDownIcon size={16} />
                      </button>
                      
                      {statusDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg z-10">
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-700"
                            onClick={() => {
                              setNewTask({...newTask, status: "To Do"});
                              setStatusDropdownOpen(false);
                            }}
                          >
                            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                            To Do
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-700"
                            onClick={() => {
                              setNewTask({...newTask, status: "In Progress"});
                              setStatusDropdownOpen(false);
                            }}
                          >
                            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                            In Progress
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-700"
                            onClick={() => {
                              setNewTask({...newTask, status: "Done"});
                              setStatusDropdownOpen(false);
                            }}
                          >
                            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                            Done
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Priority */}
                    <div className="relative">
                      <label htmlFor="priority" className="label">Priority</label>
                      <button
                        type="button"
                        className="input flex items-center justify-between"
                        onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                      >
                        <div className="flex items-center">
                          <AlertTriangleIcon 
                            size={16} 
                            className={`mr-2 ${
                              newTask.priority === "High" ? "text-red-500" :
                              newTask.priority === "Medium" ? "text-yellow-500" : "text-green-500"
                            }`} 
                          />
                          {newTask.priority}
                        </div>
                        <ChevronDownIcon size={16} />
                      </button>
                      
                      {priorityDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg z-10">
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-700"
                            onClick={() => {
                              setNewTask({...newTask, priority: "High"});
                              setPriorityDropdownOpen(false);
                            }}
                          >
                            <AlertTriangleIcon size={16} className="mr-2 text-red-500" />
                            High
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-700"
                            onClick={() => {
                              setNewTask({...newTask, priority: "Medium"});
                              setPriorityDropdownOpen(false);
                            }}
                          >
                            <AlertTriangleIcon size={16} className="mr-2 text-yellow-500" />
                            Medium
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-700"
                            onClick={() => {
                              setNewTask({...newTask, priority: "Low"});
                              setPriorityDropdownOpen(false);
                            }}
                          >
                            <AlertTriangleIcon size={16} className="mr-2 text-green-500" />
                            Low
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Due Date */}
                  <div>
                    <label htmlFor="dueDate" className="label">Due Date</label>
                    <input
                      id="dueDate"
                      type="date"
                      className="input"
                      value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ""}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : ""})}
                    />
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <label className="label">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newTask.tags.map((tag, index) => (
                        <div key={index} className={`flex items-center text-xs px-2.5 py-1 rounded-full ${getTagColor(tag)}`}>
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1.5 p-0.5 rounded-full hover:bg-surface-200/50 dark:hover:bg-surface-600/50"
                          >
                            <XIcon size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex">
                      <input
                        type="text"
                        className="input rounded-r-none"
                        placeholder="Add a tag"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 bg-primary text-white rounded-r-lg hover:bg-primary-dark transition-colors"
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewTaskModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingTask ? "Update Task" : "Add Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;