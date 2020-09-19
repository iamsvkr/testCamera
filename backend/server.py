import csv
import boto3
import json
from types import SimpleNamespace
from flask import Flask, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET', 'POST'])
def hello():
    if(request.method == 'POST'):
        data = request.form.get('file', '')
        # return data

        #photo = 'my.png'
        client = boto3.client('rekognition', region_name='us-west-2', aws_access_key_id='AKIA4SAPVMRYSBVWH454',
                              aws_secret_access_key='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')

        # with open(photo, 'rb') as source_image:
        ##    source_bytes = source_image.read()

        response = client.detect_labels(Image={
            'Bytes': bytes(data, 'utf-8')
        }, MaxLabels=10)
        return response


if __name__ == '__main__':
    app.run(debug=True, port=5000)
