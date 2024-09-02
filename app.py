import random
import json
import torch
from model import NeuralNet
from nltk_utils import bag_of_words,tokenize
import pandas as pd
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = 'data.pth'
data = torch.load(FILE)

input_size = data['input_size']
hidden_size = data['hidden_size']
output_size = data['output_size']
all_words =data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size,hidden_size,output_size)
model.load_state_dict(model_state)
model.eval()



def bot_responce(input):
    input = tokenize(input)
    X = bag_of_words(input,all_words)
    X = X.reshape(1,X.shape[0])
    X = torch.from_numpy(X)
    output = model(X)
    _, predicted = torch.max(output,dim = 1)
    tag = tags[predicted.item()]
    for intent in intents['intents']:
        if tag == intent['tag']:
            result = random.choice(intent['responses'])
            print(result)
            return result
    return 'i dont understand'






info = pd.read_csv("personal/data_set.csv")
df = pd.DataFrame(info)

def get_drug_info(drug_name, info_type):
    filtered_df = df[df["name"].str.lower() == drug_name.lower()]
    if not filtered_df.empty:
        if info_type.lower() == "uses":
            return filtered_df['uses'].values[0]
        elif info_type.lower() == "side effects":
            return filtered_df['inconvinients'].values[0]
    else:
        return None

def chatbot_response(input_text):
    response = bot_responce(input_text)
    return response

app = Flask(__name__)
CORS(app)

db = SQLAlchemy()
app.config.from_object('instance.config.config') 

db.init_app(app)



@app.route('/api/get_response', methods = ['POST','GET'])
def get_response():
    if request.method == 'POST':
        data = request.get_json()
        data = data.get('name')
        names = df['name'].str.lower().values
        if data.lower()  in names:
            response = "Do you want uses or side effects? Type 'uses' for uses, 'side effects' for side effects."
        else:
            response = chatbot_response(data.lower())
        return jsonify({'response': response})
    



@app.route('/api/get_drug_info', methods=['POST','GET'])
def get_drug_info_route():
    data = request.get_json()
    drug_name = data.get('drug_name')
    info_type = data.get('info_type')
    result = get_drug_info(drug_name, info_type)
    if result:
        response = f"The {info_type} of {drug_name} are: {result}"
    else:
        response = "Sorry, I couldn't find the information you requested."
    return jsonify({'response': response})


app.secret_key = "1588889989898"


