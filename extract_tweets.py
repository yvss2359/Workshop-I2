from flask import Flask, jsonify
import openai
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for the entire app, allowing all origins (during development)
CORS(app, resources={r"/api/*": {"origins": "*"}})

openai.api_key = "key"

# Define a function to create the API call and extract the response
def generate_question(row):
    author = row[0]
    content = row[1]

    # System message: Define the behavior as a fact checker and inappropriate content checker
    system_message = {
        "role": "system", 
        "content": (
            "Tu es un modérateur de contenu pour un site web. "
            "Tu dois vérifier deux choses avec une extrême rigueur : "
            "1. Si le contenu est inapproprié sous quelque forme que ce soit (par exemple, toute mention de violence, discours de haine, propos offensants, insultes, discrimination, contenu à caractère sexuel, harcèlement, ou tout autre contenu jugé choquant ou nuisible). "
            "2. Si le contenu contient des propos faux, trompeurs ou diffamatoires. "
            "Si le contenu est inapproprié, offensant, violent ou contient des propos faux, tu dois rejeter immédiatement ce contenu et retourner 'rejeter'. "
            "Si le contenu respecte strictement les règles de modération, tu dois retourner un JSON contenant le nom de l'utilisateur et la déclaration vérifiée."
        )
    }

    # User message: Pass the fact to be verified and checked for appropriateness
    author_message = {
        "role": "user", 
        "content": f"L'utilisateur {author} a affirmé : '{content}'. Vérifie si cette affirmation est vraie ou fausse, et si le contenu est approprié ou non."
    }

    # Make the API call to OpenAI
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[system_message, author_message]
    )

    # Extract the result from the response
    result_content = response['choices'][0]['message']['content'].strip()

    # If the response indicates inappropriate content, return None
    if result_content.lower() == "rejeter":
        return None

    # If the content is appropriate and verified, return the fact
    return {"author": author, "content": content}


# Load tweets from CSV
tweets = pd.read_csv('tweets.csv')

# Route to generate and return facts for the first 20 tweets
@app.route('/api/fact', methods=['GET'])
def get_question():
    # Initialize an empty list to hold the results
    facts = []

    # Loop through the first 20 rows of the CSV
    for i in range(min(20, len(tweets))):  # Ensure we don't go out of bounds
        tweet = tweets.iloc[i]  # Get each row as a Series
        fact = generate_question(tweet)  # Call the function to check the fact
        print(fact)
        # If a valid fact is returned (i.e., fact is not None), append to the list
        if fact:
            facts.append(fact)

    # Return the list of verified facts as JSON
    return jsonify(facts)


if __name__ == '__main__':
    app.run(debug=True)
