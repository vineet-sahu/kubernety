
const CONFIG = {
  API_URL: "http://localhost:3000/api/jobs",
  POLL_INTERVAL: 3000, 
  REQUEST_TIMEOUT: 10000, 
};


const JOB_TYPES = {
  prime: {
    label: "Calculate Primes",
    task: "calculate_primes",
    fields: [{ name: "limit", type: "number", placeholder: "100000", default: '' }],
  },
  hash: {
    label: "Hash Text",
    task: "hash_text",
    fields: [{ name: "text", type: "text", placeholder: "HelloWorld", default: '' }],
  },
  sort: {
    label: "Sort Array",
    task: "sort_array",
    fields: [{ name: "size", type: "number", placeholder: "100000", default: '' }],
  },
  matrix: {
    label: "Matrix Multiply",
    task: "matrix_multiply",
    fields: [{ name: "size", type: "number", placeholder: "200", default: '' }],
  },
  fib: {
    label: "Fibonacci",
    task: "fibonacci",
    fields: [{ name: "n", type: "number", placeholder: "40", default: '' }],
  },
};


const STATUS_STYLES = {
  Done: "border p-2 text-green-600 font-semibold",
  Queued: "border p-2 text-yellow-600",
  Processing: "border p-2 text-orange-600",
  Failed: "border p-2 text-red-600",
};


class JobManager {
  constructor() {
    this.jobs = new Map();
    this.pollInterval = null;
    this.isPolling = false;
    
    
    this.elements = {
      submitBtn: document.getElementById("submitBtn"),
      jobTypeSelect: document.getElementById("jobType"),
      inputFields: document.getElementById("inputFields"),
      statusDiv: document.getElementById("status"),
      jobTable: document.getElementById("jobTable"),
    };
    
    this.init();
  }

  init() {
    
    this.elements.jobTypeSelect.addEventListener("change", () => this.renderInputFields());
    this.elements.submitBtn.addEventListener("click", () => this.handleSubmit());
    
    this.renderInputFields();
        
    this.startPolling();
  }

  toggleSubmitButton() {
    const inputs = this.elements.inputFields.querySelectorAll("input");
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");
    this.elements.submitBtn.disabled = !allFilled;
    this.elements.submitBtn.classList.toggle("opacity-50", !allFilled);
    this.elements.submitBtn.classList.toggle("cursor-not-allowed", !allFilled);
  }

  renderInputFields() {
    const type = this.elements.jobTypeSelect.value;
    const jobConfig = JOB_TYPES[type];
  
    if (!jobConfig) {
      this.elements.inputFields.innerHTML = "";
      return;
    }
  
    const fieldsHTML = jobConfig.fields.map(field => `
      <label class="block text-sm mb-1 font-medium">${this.capitalize(field.name)}</label>
      <input 
        id="${field.name}" 
        type="${field.type}" 
        placeholder="${field.placeholder}"
        value="${field.default}"
        class="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    `).join("");
  
    this.elements.inputFields.innerHTML = fieldsHTML;
  
    
    const inputs = this.elements.inputFields.querySelectorAll("input");
    inputs.forEach(input => {
      input.addEventListener("input", () => this.toggleSubmitButton());
    });
  
    this.toggleSubmitButton();
  }

  resetInputFields() {
    const inputs = this.elements.inputFields.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
    this.toggleSubmitButton();
  }

  async handleSubmit() {
    const type = this.elements.jobTypeSelect.value;
    const jobConfig = JOB_TYPES[type];
    
    if (!jobConfig) {
      this.showStatus("Invalid job type selected", "error");
      return;
    }

    
    const data = {};
    jobConfig.fields.forEach(field => {
      const element = document.getElementById(field.name);
      const value = element?.value || field.default;
      data[field.name] = field.type === "number" ? parseInt(value) : value;
    });

    const payload = {
      task: jobConfig.task,
      data: data,
    };

    this.showStatus("Submitting job...", "info");
    this.elements.submitBtn.disabled = true;

    try {
      const response = await this.fetchWithTimeout(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      await response.json();

      this.showStatus(`Job submitted successfully!`, "success");
      
      this.resetInputFields();
      
      this.fetchJobs();
      
    } catch (error) {
      console.error("Job submission error:", error);
      this.showStatus(`Error submitting job: ${error.message}`, "error");
    } finally {
      this.elements.submitBtn.disabled = false;
    }
  }

  async fetchJobs() {
    try {
      const response = await this.fetchWithTimeout(CONFIG.API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }

      const res = await response.json();
      const jobs = res.data || [];
      
      if (Array.isArray(jobs)) {
        jobs.forEach(job => {
          this.jobs.set(job.id, job);
          this.renderJobRow(job);
        });
      }
    } catch (error) {
      console.error("Polling error:", error);
      
    }
  }

  renderJobRow(job) {
    let row = document.getElementById(job.id);
    
    if (!row) {
      row = document.createElement("tr");
      row.id = job.id;
      row.className = "hover:bg-gray-50 transition-colors";
      this.elements.jobTable.appendChild(row);
    }

    const statusClass = STATUS_STYLES[job.status] || "border p-2";
    
    row.innerHTML = `
      <td class="border p-2 font-mono text-sm">${job.id}</td>
      <td class="border p-2 uppercase text-sm">${job.type}</td>
      <td class="${statusClass}">${job.status}</td>
      <td class="border p-2 text-sm font-mono">${this.formatPayload(job.payload)}</td>
    `;
  }

  startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.pollInterval = setInterval(() => {
      this.fetchJobs();
    }, CONFIG.POLL_INTERVAL);

    this.fetchJobs();
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      this.isPolling = false;
    }
  }

  showStatus(message, type = "info") {
    const colors = {
      success: "text-green-600",
      error: "text-red-600",
      info: "text-blue-600",
    };
    
    this.elements.statusDiv.className = `mt-4 ${colors[type] || colors.info}`;
    this.elements.statusDiv.textContent = message;
  }

  formatPayload(payload) {
    if (!payload) return "{}";
    
    try {
      return JSON.stringify(payload, null, 0);
    } catch {
      return String(payload);
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  destroy() {
    this.stopPolling();
    this.elements.jobTypeSelect.removeEventListener("change", () => this.renderInputFields());
    this.elements.submitBtn.removeEventListener("click", () => this.handleSubmit());
  }
}


const jobManager = new JobManager();


window.addEventListener("beforeunload", () => {
  jobManager.destroy();
});