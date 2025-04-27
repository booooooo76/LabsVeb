// Global variable to store the currently dragged element
let draggedTask = null;

// Initialize the board when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for drag and drop
    addDragAndDropListeners();
    
    // Update task counts for each column
    updateAllTaskCounts();
    
    // Add event listeners to highlight drop zones
    highlightDropZones();
});

// Function to allow dropping
function allowDrop(event) {
    // Prevent default behavior to allow drop
    event.preventDefault();
}

// Function to handle drag start
function drag(event) {
    // Store the dragged element
    draggedTask = event.target;
    
    // Add dragging class for visual feedback
    draggedTask.classList.add('dragging');
    
    // Set the data being dragged
    event.dataTransfer.setData('text/plain', event.target.id);
    
    // Set drag effect
    event.dataTransfer.effectAllowed = 'move';
}

// Function to handle drop
function drop(event) {
    // Prevent default behavior
    event.preventDefault();
    
    // Get the dragged task id
    const taskId = event.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);
    
    // Get the target container
    let targetContainer = event.target;
    
    // Find the tasks container (if we dropped on a task or other element)
    while (targetContainer && !targetContainer.classList.contains('tasks-container')) {
        targetContainer = targetContainer.parentElement;
    }
    
    // Only proceed if we found a valid container
    if (targetContainer && taskElement) {
        // Remove dragging class
        taskElement.classList.remove('dragging');
        
        // Move the task to the new container
        targetContainer.appendChild(taskElement);
        
        // Remove drag-over class from all containers
        document.querySelectorAll('.tasks-container').forEach(container => {
            container.classList.remove('drag-over');
        });
        
        // Update task counts
        updateAllTaskCounts();
        
        // Add move animation class
        taskElement.classList.add('task-moved');
        
        // Remove the class after animation completes
        setTimeout(() => {
            taskElement.classList.remove('task-moved');
        }, 300);
    }
}

// Function to add event listeners for drag and drop
function addDragAndDropListeners() {
    // Add dragend event listener to all tasks
    document.querySelectorAll('.task').forEach(task => {
        task.addEventListener('dragend', function() {
            // Remove dragging class if drag operation is cancelled
            this.classList.remove('dragging');
            
            // Remove drag-over class from all containers
            document.querySelectorAll('.tasks-container').forEach(container => {
                container.classList.remove('drag-over');
            });
        });
    });
}

// Function to update task count for a specific column
function updateTaskCount(columnId) {
    const tasksContainer = document.getElementById(`${columnId}-tasks`);
    const countElement = document.getElementById(`${columnId}-count`);
    
    if (tasksContainer && countElement) {
        const taskCount = tasksContainer.querySelectorAll('.task').length;
        countElement.textContent = taskCount;
    }
}

// Function to update all task counts
function updateAllTaskCounts() {
    updateTaskCount('todo');
    updateTaskCount('in-progress');
    updateTaskCount('review');
    updateTaskCount('done');
}

// Function to add highlight effect to drop zones
function highlightDropZones() {
    document.querySelectorAll('.tasks-container').forEach(container => {
        // Highlight when dragging over
        container.addEventListener('dragover', function() {
            this.classList.add('drag-over');
        });
        
        // Remove highlight when leaving
        container.addEventListener('dragleave', function(e) {
            // Only remove if we're leaving the container (not entering a child)
            if (!this.contains(e.relatedTarget)) {
                this.classList.remove('drag-over');
            }
        });
        
        // Remove highlight after drop
        container.addEventListener('drop', function() {
            this.classList.remove('drag-over');
        });
    });
}

// Add CSS animation for task movement
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes taskMoved {
            0% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .task-moved {
            animation: taskMoved 0.3s ease;
        }
        
        .dragging {
            opacity: 0.6;
            transform: scale(0.98);
        }
        
        .drag-over {
            background-color: #e3e7ef;
            transition: background-color 0.2s ease;
        }
    </style>
`);