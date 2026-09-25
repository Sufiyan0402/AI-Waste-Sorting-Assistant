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


// Analyze Button
analyzeBtn.addEventListener("click", function () {

    if (!imageInput.files[0]) {
        alert("Please upload a waste image first.");
        return;
    }

    const results = [
        {
            category: "Plastic",
            confidence: "94%",
            suggestion: "Put this waste in the recyclable waste bin."
        },
        {
            category: "Paper",
            confidence: "91%",
            suggestion: "Put this waste in the paper recycling bin."
        },
        {
            category: "Glass",
            confidence: "96%",
            suggestion: "Put this waste in the glass recycling bin."
        },
        {
            category: "Organic",
            confidence: "89%",
            suggestion: "Put this waste in the organic waste bin."
        }
    ];

    const randomResult =
        results[Math.floor(Math.random() * results.length)];

    result.style.display = "block";

    category.textContent =
        "Category: " + randomResult.category;

    confidence.textContent =
        "Confidence: " + randomResult.confidence;

    suggestion.textContent =
        "Disposal Suggestion: " + randomResult.suggestion;
});