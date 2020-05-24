import json
import os
from botocore.vendored import requests

def executeCommand(command:str, data:str)->str:
    if command == "patients":
        message = "ID-Name-Birthdate\n"
        for patient in data:
            for key in patient.keys():
                message += patient[key] + "\n"
    elif command == "medlist":
        message = "MedID-Name-Escalations-Missed Doses-Indication\n"
        for medication in data:
            for key in medication.keys():
                message += medication[key] + "\n"
        message += "\nSee medication detail with command /meddetail [MedID]"
    elif command == "progress":
        progress = {}
        message = ""
        for item in data:
            progresscode = item['Progress_Code']
            date = item['Date']
            if progresscode in progress:
                progress[progresscode].append(date)
            else:
                progress[progresscode] = [date]
        for key in progress.keys():
            message += "Patient experienced {} on:\n".format(key)
            for text in progress[key]:
                message += "{}\n".format(text)
    elif command == "meddetail":
        message = data
    else:
        message = "Invalid Command"

    return message

def lambda_handler(event, context):
    field_errors = {}
    
    if 'doctorid' in event:
        chat_id = int(event['doctorid'])
        chat_id = 51250299
    else:
        field_errors['chat_id'] = "Dr's ID missing"

    if 'command' in event:
        command = event['command'].split(' ',1)[0]
    else:
        field_errors['command'] = "Command missing"
        
    if 'data' in event:
        data = event['data']
    else:
        field_errors['data'] = "Data missing"

    if field_errors: 
        raise Exception(json.dumps({'field_errors': field_errors}))
        
    telegram_msg = executeCommand(command, data)
    
    params = {'chat_id': chat_id, 'text': telegram_msg}
    telegram_token = os.environ['TELEGRAM_BOT_TOKEN']
    api_url = "https://api.telegram.org/bot"+telegram_token+"/"
    res = requests.post(api_url + "sendMessage", data=params).json()
    if res["ok"]:
        return {
          "statusCode": 200,
          "body": json.dumps(telegram_msg)
        }
    else:
        print(res)
        return{
          "statusCode": 400,
          "body": res
        }
