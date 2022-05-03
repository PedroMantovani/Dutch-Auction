import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('items_para_leiloar')

# get item
def get_item(event, context):
    item = event["from"]
    response = table.query(
        KeyConditionExpression=Key('items').eq(item)
        )
    return {
    'statusCode': 200,
    'body': json.dumps(f" o item pego foi {response['Items']}")
        
    }


def post_item(event, context):
    prod = event["nome"]
    valor = event["valor"]
    try:
        table.put_item(
            Item={
            'items': prod,
            'Valor': valor
           
            }
        )
        return {
        'statusCode': 200,
        'body': json.dumps(f'o produto {prod} foi cadastrado com o valor de {valor}!')
            
        }
    except:
        return "erro"
    
    
def put_item(event, context):
    prod = event["nome"]
    # try:
    table.update_item(
    Key={
            'items': prod
            },
            UpdateExpression='SET Valor = :val1',
            ExpressionAttributeValues={
                ':val1': 1
            }
        )
    return {
        'statusCode': 200,
        'body': json.dumps(f'o produto {prod} foi Atualizado!')
            
        }


def delete_item(event, context):
    prod = event["nome"]
    try:
        table.delete_item(
            Key={
            'items': prod
            }
        )
        return {
        'statusCode': 200,
        'body': json.dumps(f'o produto {prod} excluido')
            
        }
    except:
        return "erro"