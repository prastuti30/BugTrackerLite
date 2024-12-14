// Select elements
const bugForm = document.getElementById('bug-form');
const bugList = document.getElementById('bug-list');

// Array to store bugs
let bugs = [
  {
    title: "Login Failure",
    description: "User cannot log in with correct credentials.",
    priority: "High",
    solution: "Check the server authentication endpoint and database."
  },
  {
    title: "Page Not Loading",
    description: "Homepage takes too long to load.",
    priority: "Medium",
    solution: "Optimize the images and minify CSS/JS files."
  }
];

// Render Bugs
function renderBugs() {
  bugList.innerHTML = ''; // Clear existing bugs

  bugs.forEach((bug, index) => {
    const bugItem = document.createElement('li');
    bugItem.className = 'bug-item';

    bugItem.innerHTML = `
      <strong>${bug.title}</strong> - <em>${bug.priority}</em>
      <p>${bug.description}</p>
      <p><strong>Solution:</strong> ${bug.solution || 'No solution yet'}</p>
      <div class="actions">
        <button onclick="deleteBug(${index})">Delete</button>
        <button onclick="suggestSolution(${index})">Ask AI</button>
      </div>
    `;

    bugList.appendChild(bugItem);
  });
}

// Add Bug
function addBug(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const priority = document.getElementById('priority').value;

  const newBug = {
    title,
    description,
    priority,
    solution: null // Placeholder for AI-generated solution
  };

  bugs.push(newBug);
  renderBugs();
  bugForm.reset();
}

// Delete Bug
function deleteBug(index) {
  bugs.splice(index, 1);
  renderBugs();
}

// Request AI Solution for a Bug
async function suggestSolution(index) {
  const bug = bugs[index];
  
  // Show loading indicator
  bugs[index].solution = "Fetching AI-generated solution...";
  renderBugs();
  
  try {
    // Send a request to your server
    const response = await fetch('http://localhost:5000/suggest-solution', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: bug.description }), // Send only the description
    });

    if (!response.ok) {
      throw new Error("Failed to fetch AI solution from the server");
    }

    const data = await response.json();
    const solution = data.solution;

    // Update bug's solution
    bugs[index].solution = solution;
  } catch (error) {
    bugs[index].solution = "Unable to fetch solution. Please try again later.";
    console.error(error);
  } finally {
    renderBugs();
  }
}

// Create Bug Watermarks
function createBugWatermarks() {
  // Select the body element
  const body = document.body;

  // Create a container for bug watermarks
  const watermarkContainer = document.createElement('div');
  watermarkContainer.className = 'watermark-container';
  body.appendChild(watermarkContainer);

  // Define the bug symbol (e.g., 🐞 emoji or any character)
  const bugSymbol = '🐞';
  const bugCount = 50; // Adjust the number of bugs

  // Generate random bug symbols
  for (let i = 0; i < bugCount; i++) {
    const bug = document.createElement('span');
    bug.className = 'bug-symbol';
    bug.innerText = bugSymbol;

    // Randomly position bugs
    const x = Math.random() * 100; // Percentage for left
    const y = Math.random() * 100; // Percentage for top
    const rotate = Math.random() * 360; // Random rotation
    const size = Math.random(); // Random size
    const opacity = Math.random() * 0.7 + 0.3; // Random opacity (0.3 to 1)

    bug.style.left = `${x}%`;
    bug.style.top = `${y}%`;
    bug.style.setProperty('--rotate', rotate);
    bug.style.setProperty('--size', size);
    bug.style.opacity = opacity;

    watermarkContainer.appendChild(bug);
  }
}

// Initialize App
function init() {
  renderBugs();
  createBugWatermarks();
  bugForm.addEventListener('submit', addBug);
}

init();
