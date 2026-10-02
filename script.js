const API_URL = API_BASE_URL + "/api/tasks";

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const tasks = await response.json();
        console.log("Tasks loaded successfully:", tasks);
        displayTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

function displayTasks(tasks) {
    // Target multiple possible container IDs/classes used in the template
    const container = document.getElementById("task-container") || 
                      document.querySelector(".task-container") || 
                      document.getElementById("tasks-container") ||
                      document.querySelector("tbody");
                      
    if (!container) {
        console.error("No task container found in HTML!");
        return;
    }
    
    container.innerHTML = "";
    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-card";
        div.style.marginBottom = "10px";
        div.style.padding = "10px";
        div.style.border = "1px solid #333";
        div.style.borderRadius = "8px";
        div.innerHTML = `
            <h4 style="margin: 0 0 5px 0;">${task.title}</h4>
            <p style="margin: 0 0 5px 0; font-size: 0.9em; color: #ccc;">${task.description}</p>
            <span style="font-size: 0.8em; padding: 2px 6px; background: #222; border-radius: 4px;">${task.status}</span>
        `;
        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", loadTasks);
