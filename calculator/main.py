from flask import Flask, render_template, request, jsonify
import base64
import google.generativeai as genai

app = Flask(__name__)
API = "AIzaSyApZiBH8ivGJfx3wEkV6oTG8Yqqa2PhRzI"
genai.configure(api_key=API)

@app.route('/')
def home():
    return render_template("whiteboard.html")

@app.route('/process-whiteboard', methods=['POST'])
def process_whiteboard():
    data = request.json
    image_data = data['image']
    image_bytes = base64.b64decode(image_data)

    with open('whiteboard_image.png', 'wb') as f:
        f.write(image_bytes)
    
    try:
        my_file = genai.upload_file("whiteboard_image.png")
        model = genai.GenerativeModel("gemini-1.5-flash")
        result = model.generate_content(
            [my_file, "\n\n", "Analyze the image I uploaded from a whiteboard application and provide a concise summary of the content. If the drawing includes any mathematical or physics questions, please include a short solution of it in the generated response. If the solution is longer than 10-22 words, then include the answer only. remember to keep the response under 10-22 words strictly."]
        )
        generated_text = result.text

        print(generated_text)
    except Exception as e:
        generated_text = f"Error generating content: {e}"

    return jsonify({'message': generated_text})

# @app.route("/answer_page")


if __name__ == '__main__':
    app.run(debug=True)
