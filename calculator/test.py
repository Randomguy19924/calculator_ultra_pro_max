import google.generativeai as genai
API = "AIzaSyApZiBH8ivGJfx3wEkV6oTG8Yqqa2PhRzI"

genai.configure(api_key=API)

# my_file = genai.upload_file("whiteboard_image.png")
# print(f"{my_file=}")




model = genai.GenerativeModel("gemini-1.5-flash")
result = model.generate_content(
    ["\n\n", "What are your limits?"]
)
print(result.text)

