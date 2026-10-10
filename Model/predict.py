import sys
import json
import numpy as np
import tensorflow as tf
from PIL import Image
from huggingface_hub import hf_hub_download

def predict(image_path):
    model_path = hf_hub_download(
        repo_id="NeoAivara/waste-classification-model",
        filename="waste_classification_model.keras"
    )

    model = tf.keras.models.load_model(model_path, compile=False)

    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))

    data = np.array(image, dtype=np.float32) / 255.0
    data = np.expand_dims(data, axis=0)

    predictions = model.predict(data, verbose=0)[0]

    labels = [
        "Cardboard", "Glass", "Metal",
        "Paper", "Plastic", "Trash"
    ]

    index = int(np.argmax(predictions))

    return {
        "category": labels[index],
        "confidence": round(float(predictions[index]) * 100, 2)
    }

if __name__ == "__main__":
    try:
        result = predict(sys.argv[1])
        print(json.dumps(result))
    except Exception as error:
        print(json.dumps({"error": str(error)}))
        sys.exit(1)