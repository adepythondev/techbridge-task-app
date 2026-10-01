import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Welcome to the TechBridge Task API! Go to /api/tasks to view your tasks."

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = [
        {"id": 1, "title": "Task 1", "description": "HTML/CSS setup", "status": "Completed"},
        {"id": 2, "title": "Task 2", "description": "Responsive layout", "status": "Completed"},
        {"id": 3, "title": "Task 3", "description": "JavaScript interactivity", "status": "In Progress"},
        {"id": 4, "title": "Task 4", "description": "DOM manipulation", "status": "Not Started"},
        {"id": 5, "title": "Task 5", "description": "API Integration", "status": "Not Started"},
        {"id": 6, "title": "Task 6", "description": "State Management", "status": "Not Started"},
        {"id": 7, "title": "Task 7", "description": "Testing and Debugging", "status": "Not Started"},
        {"id": 8, "title": "Task 8", "description": "Final Deployment", "status": "Not Started"}
    ]
    return jsonify(tasks)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
