
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Please upload a valid image file."));
    }
  }
});

app.get("/", (req, res) => {
  res.send("AI Waste Sorting Assistant Backend is running!");
});

app.post("/api/analyze", (req, res) => {
  upload.single("image")(req, res, (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a waste image."
      });
    }

    const imagePath = req.file.path;
    const pythonScript = path.resolve(
      __dirname, "..", "model", "predict.py"
    );

    const python =
      "C:\\Users\\Sufiyan\\AppData\\Local\\Programs\\Python\\Python312\\python.exe";

    const cleanup = () => {
      fs.unlink(imagePath, () => {});
    };

    if (!fs.existsSync(pythonScript)) {
      cleanup();
      return res.status(500).json({
        error: `Python script not found: ${pythonScript}`
      });
    }

    if (!fs.existsSync(python)) {
      cleanup();
      return res.status(500).json({
        error: `Python executable not found: ${python}`
      });
    }

    console.log("Analyzing image:", req.file.originalname);

    execFile(
      python,
      [pythonScript, imagePath],
      {
        timeout: 120000,
        maxBuffer: 2 * 1024 * 1024,
        windowsHide: true
      },
      (error, stdout, stderr) => {
        cleanup();

        if (stderr && stderr.trim()) {
          console.log("Python diagnostics:", stderr.trim());
        }

        if (error) {
          console.error("PYTHON ERROR:", error.message);
          console.error("PYTHON STDOUT:", stdout);

          let message = error.killed
            ? "AI prediction timed out. Please try again."
            : "AI prediction failed. Check the backend terminal.";

          try {
            const parsed = JSON.parse((stdout || "").trim());
            if (parsed.error) message = parsed.error;
          } catch {
            // Keep the diagnostic message above.
          }

          return res.status(500).json({ error: message });
        }

        let result;

        try {
          result = JSON.parse((stdout || "").trim());
        } catch (parseError) {
          console.error("Invalid Python output:", stdout);
          return res.status(500).json({
            error: "AI returned an invalid response. Check the backend terminal."
          });
        }

        if (result.error) {
          console.error("AI MODEL ERROR:", result.error);
          return res.status(500).json({ error: result.error });
        }

        if (
          typeof result.category !== "string" ||
          typeof result.confidence !== "number"
        ) {
          console.error("Unexpected prediction:", result);
          return res.status(500).json({
            error: "AI did not return a valid category and confidence."
          });
        }

        const bins = {
          Plastic: "Put this waste in the recyclable waste bin.",
          Paper: "Put this waste in the paper recycling bin.",
          Cardboard: "Put this waste in the cardboard recycling bin.",
          Glass: "Put this waste in the glass recycling bin.",
          Metal: "Put this waste in the metal recycling bin.",
          Trash: "Put this waste in the general waste bin."
        };

        console.log(
          `Prediction: ${result.category} (${result.confidence}%)`
        );

        return res.json({
          category: result.category,
          confidence: result.confidence,
          suggestion:
            bins[result.category] ||
            "Check local waste sorting guidelines."
        });
      }
    );
  });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  if (res.headersSent) return next(err);

  return res.status(500).json({
    error: "Backend error: " + err.message
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
