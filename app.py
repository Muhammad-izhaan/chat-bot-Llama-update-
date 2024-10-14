from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

# Add your API key here
API_KEY = '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'  # Replace with your actual API key
client = Groq(api_key=API_KEY)  # Pass the API key while initializing the client

# Predefined questions and responses
predefined_responses = {
    "who are you": "I am a chat-bot developed by izhaan",
    "who is your developer": "I am designed and developed by Izhan, while i use Meta's Llama as dataset",
    "your developer": "I am  developed by Izhaan",
    "who is izhan": "Izhan is my developer",
    "tell me about izhan": "You can know more about izhaan by taking a look at his website 'http://izhyverse.rf.gd",
    "Izhan": "My master!",
    "mother of izhaan": "Shagufta Imtiyaz",
    " izhaan birthday": "05-05-2007",
    "who programmed you": "Izhan programmed me",
    "tell me about izhan": "You can know more about izhaan by taking a look at his website 'http://izhyverse.rf.gd",
    "izhan projects": "checkout at ''http://izhyverse.rf.gd''",
    
 

}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_message = request.json.get('message')
    
    if not user_message:
        return jsonify({"response": "Please provide a message."})

    # Check for predefined response
    for question, response in predefined_responses.items():
        if question in user_message.lower():  # Check if the predefined question is in the user message
            return jsonify({'response': response})

    try:
        # Create chat completion
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": user_message}],
            model="llama3-8b-8192",
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=True,
            stop=None
        )

        # Collect response chunks
        response = ""
        for chunk in chat_completion:
            if chunk.choices and chunk.choices[0].delta:
                response += chunk.choices[0].delta.content or ''
        
        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
