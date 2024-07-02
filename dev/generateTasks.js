// thanks to chatGpt

const fs = require("fs");

// Define the possible actions
const actions = ["do", "go", "stop"];

// Define the possible verbs and objects for tasks
const verbs = [
  "Fix",
  "Implement",
  "Pause",
  "Update",
  "Start",
  "Stop",
  "Refactor",
  "Deploy",
  "Halt",
  "Optimize",
  "Run",
  "Clean",
  "Launch",
  "Document",
  "Initialize",
  "Analyze",
  "Set up",
  "Cancel",
  "Improve",
  "Activate",
  "Enhance",
  "Validate",
  "Generate",
  "Review",
  "Execute",
  "Suspend",
  "Audit",
  "Boot up",
  "Conduct",
  "Discontinue",
  "Schedule",
  "Compile",
  "Merge",
  "Push",
  "Build",
  "Finalize",
  "Disable",
  "End",
  "Debug",
  "Prepare",
  "Test",
  "Enable",
  "Configure",
  "Terminate",
  "Revise",
  "Clean up",
  "Create",
  "Install",
];

const objects = [
  "the bug in the login module",
  "user authentication",
  "the deployment pipeline",
  "the README file",
  "the server for testing",
  "the database service",
  "the user profile component",
  "the latest changes to staging",
  "the script execution",
  "the search algorithm",
  "the end-to-end tests",
  "the background job scheduler",
  "the temporary files",
  "the new feature in production",
  "the web server",
  "the API endpoints",
  "the project repository",
  "the continuous integration",
  "the system logs",
  "the data migration script",
  "the project dependencies",
  "the monitoring tool",
  "the scheduled task",
  "the error handling mechanism",
  "the maintenance mode",
  "the performance test",
  "the user interface",
  "the logging service",
  "the user session",
  "the testing strategy",
  "the load balancer",
  "the current operation",
  "the input data",
  "the API keys",
  "the file upload",
  "the caching strategy",
  "the database backup",
  "the network connection",
  "the pull request",
  "the deployment script",
  "the cron job",
  "the codebase",
  "the software update",
  "the user account",
  "the security audit",
  "the virtual machine",
  "the log rotation",
  "the performance review",
  "the environment variables",
  "the service",
  "the meeting",
  "the application",
  "the logging process",
  "the user guide",
  "the application server",
  "the email notifications",
  "the code",
  "the feature flag",
  "the testing session",
  "the development branch",
  "the changes to the repository",
  "the message queue",
  "the database queries",
  "the project",
  "the video stream",
  "the documentation",
  "the integration tests",
  "the user account",
  "the access logs",
  "the deployment pipeline",
  "the live stream",
  "the codebase",
  "the system diagnostics",
  "the API requests",
  "the issue",
  "the release notes",
  "the data processing",
  "the new feature",
  "the analytics tool",
  "the server monitoring",
  "the firewall rules",
  "the migration process",
  "the automated tests",
  "the CI/CD pipeline",
  "the data analysis",
  "the error reporting",
  "the code coverage",
  "the microservices",
  "the running jobs",
  "new unit tests",
  "the failover process",
  "the background service",
  "the loading speed",
  "the database script",
  "the SSH access",
  "the security protocols",
  "the container",
  "the remote access",
];

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random request
function generateRandomRequest() {
  const action = actions[getRandomInt(0, actions.length - 1)];
  const verb = verbs[getRandomInt(0, verbs.length - 1)];
  const object = objects[getRandomInt(0, objects.length - 1)];
  const task = `${verb} ${object}`;
  return [action, task];
}

// Function to generate an array of random requests
function generateRandomRequests(numberOfRequests) {
  const requests = [];
  for (let i = 0; i < numberOfRequests; i++) {
    requests.push(generateRandomRequest());
  }
  return requests;
}

// Generate a specified number of random requests (e.g., 300)
const numberOfRequests = process.argv.slice(2)[0];
if (!numberOfRequests) {
  console.error(`Usage: you must supply a number of requests to generate`);
  return;
}

const randomRequests = generateRandomRequests(numberOfRequests);

// Print the random requests to the console (or write to a file)
// console.log(JSON.stringify(randomRequests, null, 2));

// Optionally, write the requests to a file
fs.writeFileSync("random_requests.json", JSON.stringify(randomRequests));

console.log(
  `Generated ${numberOfRequests} random requests and saved to random_requests.json`
);
