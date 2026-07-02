const form = document.getElementById("discoveryForm");
const steps = Array.from(document.querySelectorAll(".form-step"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const stepLabel = document.getElementById("stepLabel");
const stepTitle = document.getElementById("stepTitle");
const progressFill = document.getElementById("progressFill");

let currentStep = 0;

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/E6kJjCkXCeOgpU5OhZJh/webhook-trigger/9af9b0c5-d79a-487b-958d-ddafbb0bf99d";

function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  const totalSteps = steps.length;
  const title = steps[currentStep]?.dataset.title || "Discovery";

  stepLabel.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
  stepTitle.textContent = title;
  progressFill.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;

  prevBtn.style.display = currentStep === 0 ? "none" : "inline-flex";
  nextBtn.style.display = currentStep === totalSteps - 1 ? "none" : "inline-flex";
  submitBtn.style.display = currentStep === totalSteps - 1 ? "inline-flex" : "none";
}

function showError(field) {
  field.classList.add("error");
}

function clearError(field) {
  field.classList.remove("error");
}

function validateCurrentStep() {
  const current = steps[currentStep];
  const requiredFields = Array.from(current.querySelectorAll("[required]"));

  let isValid = true;

  requiredFields.forEach((field) => {
    clearError(field);

    if (field.type === "checkbox") {
      if (!field.checked) {
        showError(field);
        isValid = false;
      }
      return;
    }

    if (!field.value || !field.value.trim()) {
      showError(field);
      isValid = false;
    }
  });

  if (!isValid) {
    alert("Please complete the required fields before continuing.");
  }

  return isValid;
}

function collectFormData() {
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      data[key] = `${data[key]}, ${value}`;
    } else {
      data[key] = value;
    }
  }

  return data;
}

nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentStep < steps.length - 1) {
    currentStep++;
    updateStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

form.addEventListener("input", (event) => {
  clearError(event.target);
});

form.addEventListener("change", (event) => {
  clearError(event.target);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  const data = collectFormData();

  console.log("12 Stone Discovery Submission:", data);

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    sessionStorage.setItem("discoverySubmission", JSON.stringify(data));
    window.location.assign("thank-you.html");
  } catch (error) {
    console.error("Submission error:", error);
    alert("There was a problem submitting your discovery session. Please try again.");
  }
});

updateStep();