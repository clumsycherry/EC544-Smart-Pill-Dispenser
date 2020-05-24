import json
import os
from botocore.vendored import requests

def executeCommand(command:str, chat_id:int, text:str)->str:
    hyper_url = "http://ec544.hopto.org:7786/"
    if command == "patients":
        requests.post(hyper_url + "patients", data={"did": chat_id}).json()
        #requests.post("https://1eb82cd0e02229fbc16e5923449d0dcf.m.pipedream.net", data={"did": chat_id}).json()
    elif command == "prescriptions":
        #requests.post(hyper_url + "medlist", data={"did": chat_id, "pid": text.replace('/prescriptions', '').strip()}).json()
        requests.post("https://1eb82cd0e02229fbc16e5923449d0dcf.m.pipedream.net", data={"did": chat_id, "pid": text.replace('/prescriptions', '').strip()}).json()
    elif command == "progress":
        #requests.post(hyper_url + "progress", data={"did": chat_id, "pid": text.replace('/progress', '').strip()}).json()
        requests.post("https://1eb82cd0e02229fbc16e5923449d0dcf.m.pipedream.net", data={"did": chat_id, "pid": text.replace('/progress', '').strip()}).json()
    elif command == "meddetail":
        #requests.post(hyper_url + "meddetail", data={"did": chat_id, "pid": text.replace('/meddetail', '').strip()}).json()
        requests.post("https://1eb82cd0e02229fbc16e5923449d0dcf.m.pipedream.net", data={"did": chat_id, "pid": text.replace('/meddetail', '').strip()}).json()
    else:
        return "Valid bot commands:\n" \
                "/patients - name & age of patients\n" \
                "/progress - side effects or symptoms this week\n" \
                "/prescriptions [patient ID] - list of medications\n" \
                "/meddetail [med ID] - details of 1 medication {}".format(command)
    return 'ok'

def lambda_handler(event, context):

    field_errors = {}
    command = ""
    
    if 'message' in event:
        message = event['message']
        
        if 'from' in message:
            chat_id = str(message['from']['id']).strip()
        else:
            field_errors['chat_id'] = "Dr's ID missing"
        
        if 'text' in message:    
            text = message['text']
        else:
            field_errors['text'] = "Text missing"
            
        if 'entities' in message:
            entities = message['entities']
            for entity in entities:
                if entity['type'] == "bot_command":
                    command = text[entity['offset']+1:entity['offset']+entity['length']]
                    telegram_msg = executeCommand(command, chat_id, text)
                    if telegram_msg != 'ok':
                        params = {'chat_id': chat_id, 'text': telegram_msg}
                        telegram_token = os.environ['TELEGRAM_BOT_TOKEN']
                        api_url = "https://api.telegram.org/bot"+telegram_token+"/"
                        res = requests.post(api_url + "sendMessage", data=params).json()
                        if not res["ok"]:
                            print(res)
                            return{
                              "statusCode": 400,
                              "body": res
                            }
                    break
    else:
        field_errors['message'] = "Message missing"
        
    if field_errors: 
        raise Exception(json.dumps({'field_errors': field_errors}))

    return {
      "statusCode": 200,
      "body": "success"
    }
