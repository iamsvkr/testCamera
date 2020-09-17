import csv
import boto3
from flask import Flask, request
app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def hello():
    if(request.method == 'GET'):
        with open('credentials.csv', 'r') as input:
            next(input)
            reader = csv.reader(input)
            for line in reader:
                access_key_id = line[2]
                secret_access_key = line[3]

            photo = 'my.png'
            client = boto3.client('rekognition', region_name='us-west-2', aws_access_key_id='AKIA4SAPVMRYSBVWH454',
                                  aws_secret_access_key='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')

            with open(photo, 'rb') as source_image:
                source_bytes = source_image.read()

            response = client.detect_labels(Image={
                'Bytes': source_bytes
            }, MaxLabels=10)

            print(response)
            return response


if __name__ == '__main__':
    app.run(debug=True)
