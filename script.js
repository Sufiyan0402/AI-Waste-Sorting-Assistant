const imageInput = document.getElementById("wasteImage");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");

const result = document.getElementById("result");
const category = document.getElementById("category");
const confidence = document.getElementById("confidence");
const suggestion = document.getElementById("suggestion");

// Image Preview
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

// Analyze Button Click Event
analyzeBtn.addEventListener("click", async function () {
    const file = imageInput.files[0];

    if (!file) {
        alert("Please upload a waste image first.");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing with AI...";

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("http://localhost:5000/api/analyze", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            result.style.display = "block";
            category.textContent = "Category: " + data.category;
            confidence.textContent = "Confidence: " + data.confidence;
            suggestion.textContent = "Disposal Suggestion: " + data.suggestion;
        } else {
            alert(data.error || "Something went wrong.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the backend server.");
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze Waste";
    }
});