from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

# Load the model on startup. This can take a few seconds.
print("Loading sentence-transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully.")

@app.route('/api/ai/embed', methods=['POST'])
def embed():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Text field is required.'}), 400

try:
        text = data['text']
        embedding = model.encode(text).tolist()
        return jsonify({'embedding': embedding})
    except Exception as e:
        print(f"Error encoding text: {e}")
        return jsonify({'error': 'Failed to generate embedding.'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return "OK", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
