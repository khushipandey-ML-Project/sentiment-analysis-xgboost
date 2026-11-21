from flask import Flask, request, jsonify, send_from_directory
import joblib
import re
import emoji

app = Flask(__name__, static_folder="website", static_url_path="")


# Load saved models
model = joblib.load("models/xgboost_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
encoder = joblib.load("models/label_encoder.pkl")


# Clean text (same preprocessing as main.py)
def clean_text(text):
    text = str(text).lower()

    # Convert emojis into English descriptions
    text = emoji.demojize(text, language="en")

    # Remove special characters
    text = re.sub(r"[^a-zA-Z\s]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


# Open website homepage
@app.route("/")
def home():
    return send_from_directory("website", "index.html")


# Predict sentiment
@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json(silent=True) or {}
    review = data.get("review", "")

    if not isinstance(review, str) or not review.strip():
        return jsonify({"error": "Please enter your text"}), 400

    cleaned_review = clean_text(review)

    review_vector = vectorizer.transform([cleaned_review])

    prediction = model.predict(review_vector)

    sentiment = encoder.inverse_transform(prediction)

    return jsonify({"sentiment": sentiment[0]})


if __name__ == "__main__":
    app.run(debug=True)