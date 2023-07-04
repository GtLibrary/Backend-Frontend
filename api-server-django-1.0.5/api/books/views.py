import os
import re
import json
import requests
import base64
import time
from django.shortcuts import render
from api.books.serializers import BooksSerializer
from api.books.models import Books
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from django.utils.html import strip_tags
from api.books.moralis import Moralis
# from api.books.minter import MyFirstMinter
# from api.books.minter import MySecondMinter
# from api.books.minter import Minter
from web3 import Web3, HTTPProvider
from eth_account.messages import encode_defunct
from api.openaikey.models import Apikey
from api.wallet.models import Wallet, WalletTransaction
from api.aiprice.models import AIpricemodel
from django.db.models import Q
from api.wallet.serializers import WalletSerializer, WalletTransactionSerializer
import openai
from google.cloud import texttospeech
#import dotenv
#dotenv.read_dotenv(os.path.join(os.path.join(os.path.dirname(os.path.dirname(__file__)), "."), '.env'))

from dotenv import load_dotenv
load_dotenv()

ttscwd = os.getcwd()
ttspath = (ttscwd + '/static/google_secret_key.json')
os.environ['GOOGLE_APPLICATION_CREDENTIALS']= ttspath

# CLEANR = re.compile('<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});')


#load_dotenv()

moralis = Moralis()

web3 = Web3(Web3.HTTPProvider(os.environ["speedyNode"]))
#os.environ['DJANGO_SETTINGS_MODULE']
securePort = os.environ['securePort']
secureHost = os.environ['secureHost']
cCAPrivateKey = os.environ['cCAPrivateKey']
openai.api_key = os.environ["OPENAI_API_KEY"]
marketPlaceAddress = os.environ['marketPlaceAddress']
cc_address = os.environ['cultureCoinAddress']

if not marketPlaceAddress:
    #marketPlaceAddress = "0x0000000000000000000000000000000000000000"
    print("I dont have a marketPlaceAddress")

moralisdir = "/home/john/bakerydemo/moralis/"

# Create your views here.
@api_view(['GET'])
def getbooklist(request):
    fields = ('id', 'author_name', 'book_price', 'title','image_url', 'bt_contract_address')
    books = Books.objects.filter(Q(user__is_verify=True)).only('id', 'author_name', 'book_price', 'title','image_url', 'bt_contract_address')
    data = BooksSerializer(books, context={"request": request}, many=True, fields = fields).data
    return Response(data)

@api_view(['GET'])
def getbookdatabyId(request, pk):
    fields = ('id', 'title','image_url', 'author_name', 'book_price', 'datamine', 'introduction', 'bt_contract_address', 'hb_contract_address', 'book_type_id', 'bm_listdata', 'is_ads', 'hardbound_price', 'book_description', 'hardbound_description', 'byteperbookmark')
    book = Books.objects.filter(pk=pk).only('id', 'title','image_url', 'book_price', 'datamine', 'introduction', 'bt_contract_address', 'hb_contract_address', 'book_type_id', 'bm_listdata', 'is_ads', 'hardbound_price', 'book_description', 'hardbound_description', 'byteperbookmark')
    data = BooksSerializer(book, context={"request": request}, many=True, fields = fields).data
    return Response(data)

@api_view(['GET'])
def getnftitemdatabyId(request, pk):
    fields = ('id', 'title','image_url', 'author_name', 'book_price', 'datamine', 'introduction', 'bt_contract_address', 'hb_contract_address', 'bm_listdata', 'hardbound_price', 'book_description', 'hardbound_description', 'max_book_supply', 'max_hardbound_supply')
    book = Books.objects.filter(pk=pk).only('id', 'title','image_url', 'book_price', 'datamine', 'introduction', 'bt_contract_address', 'hb_contract_address', 'bm_listdata', 'hardbound_price', 'book_description', 'hardbound_description', 'max_book_supply', 'max_hardbound_supply')
    data = BooksSerializer(book, context={"request": request}, many=True, fields = fields).data
    return Response(data)

@api_view(['GET'])
def getCCRate(request):
    
    cwd = os.getcwd()
    path = (cwd + '/static/CultureCoin.json')
    contract_abi = json.load(open(path))
    ccoin_address = Web3.toChecksumAddress(cc_address)
    CC_Contract = web3.eth.contract(address=ccoin_address, abi=contract_abi)
    cc_rate = CC_Contract.functions.getDexCCRate().call()
    return Response({"cc_rate": cc_rate})
    
@api_view(['POST'])
def getdownloadepubfile(request, pk):
    req_data = request.body.decode('utf-8')
    body = json.loads(req_data)
    bookdata = Books.objects.get(pk=pk)
    sender = body['account']

    # bmsupply =  getBookmarkTotalSupply(bookcontent.bm_contract_address)
    cwd = os.getcwd()
    path = (cwd + '/static/BookTradable.json')
    contract_abi = json.load(open(path))
    bt_address = Web3.toChecksumAddress(bookdata.bt_contract_address)
    bt_Contract = web3.eth.contract(address=bt_address, abi=contract_abi)
    token_cnt = bt_Contract.functions.balanceOf(Web3.toChecksumAddress(sender)).call()
    if (token_cnt > 0): 
        fields = ('id', 'epub_file')
        book = Books.objects.filter(pk=pk).only('id', 'epub_file')
        data = BooksSerializer(book, context={"request": request}, many=True, fields = fields).data
        return Response(data)
    else:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def getdownloadaudiofile(request, pk):
    req_data = request.body.decode('utf-8')
    body = json.loads(req_data)
    bookdata = Books.objects.get(pk=pk)
    sender = body['account']

    # bmsupply =  getBookmarkTotalSupply(bookcontent.bm_contract_address)
    cwd = os.getcwd()
    path = (cwd + '/static/BookTradable.json')
    contract_abi = json.load(open(path))
    bt_address = Web3.toChecksumAddress(bookdata.bt_contract_address)
    bt_Contract = web3.eth.contract(address=bt_address, abi=contract_abi)
    token_cnt = bt_Contract.functions.balanceOf(Web3.toChecksumAddress(sender)).call()
    if (token_cnt > 0): 
        fields = ('id', 'audio_file')
        book = Books.objects.filter(pk=pk).only('id', 'audio_file')
        data = BooksSerializer(book, context={"request": request}, many=True, fields = fields).data
        return Response(data)
    else:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def getttsaudiofile(request, pk):
    req_data = request.body.decode('utf-8')
    body = json.loads(req_data)
    bookdata = Books.objects.get(pk=pk)
    text = strip_tags(bookdata.content)
    text = text.encode('utf-8')
    sender = body['account']

    cwd = os.getcwd()
    path = (cwd + '/static/BookTradable.json')
    contract_abi = json.load(open(path))
    bt_address = Web3.toChecksumAddress(bookdata.bt_contract_address)
    bt_Contract = web3.eth.contract(address=bt_address, abi=contract_abi)
    token_cnt = bt_Contract.functions.balanceOf(Web3.toChecksumAddress(sender)).call()
    if (token_cnt > 0): 
        client = texttospeech.TextToSpeechClient()

        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code='en-US',
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )

        # return HttpResponse(response.audio_content, content_type='audio/mp3')
    
        response = HttpResponse(response.audio_content, content_type='audio/mp3')
        response['Content-Disposition'] = 'attachment; filename="audio.mp3"'
        return response
    else:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getadslist(request):
    fields = ('id', 'adcontent')
    books = Books.objects.filter(is_ads=True).only('id', 'adcontent')
    data = BooksSerializer(books, context={"request": request}, many=True, fields = fields).data
    return Response(data)

@api_view(['GET'])
def getBookContentbyId(request, pk):
    content = Books.objects.get(pk=pk)
    return Response(content.content)

@api_view(['GET'])
def getBookAdContentbyId(request, pk):
    adcontent = Books.objects.get(pk=pk)
    content = adcontent.adcontent
    if(content.find("<figure") > 0):
        figure_content = content[content.index("<figure"): content.index("</figure>") + 9]
        temp_content = content.replace(figure_content, '').replace('<p>', '').replace('</p>', '\n')
    else:
        figure_content = ''
        temp_content = content.replace('<p>', '').replace('</p>', '')
    return Response({"content": temp_content, "book_image": figure_content, "origincontent": content})

#
# Calulate the portential of the contract/work of art.
#

def verifyRewards(bookmarkcontractid, bookcontractid):
    print("verifyRewards: " + str(bookmarkcontractid) + " " + str(bookcontractid))
    verified = getFromBackend(bookmarkcontractid + "/verifyrewards/" + bookcontractid) 
    return verified

def getFromBackend(url):

    print("cCAPrivateKey: " + cCAPrivateKey)

    if cCAPrivateKey != "encrypted":
        print("getFromBackend: " + url)
        tmpFile = os.environ["SERVICE_TMPFILE"]
        print("tmpFile: " + tmpFile)
        f = open(tmpFile, 'r')
        port = f.read().strip()
        print("port: " + str(port))
        f.close()

        response = requests.get("http://localhost:" + port + "/" + url)
        print("response: " + response.text)
        return response.text
    else:
        print("secure request incoming")
        port = securePort
        host = secureHost

        response = requests.get("https://" + host + ":" + port + "/" + url, verify="/home/john/bakerydemo/moralis/cert.pem")
        print("response: " + response.text)
        return response.text

def getBookmarkTotalSupply(bookmarkcontractid):

    currentBookmarlTotalSupply = getFromBackend(bookmarkcontractid + "/totalsupply")
    print("currentBookmarlTotalSupply: " + str(currentBookmarlTotalSupply))
    try:
        currentBookmarlTotalSupply = int(currentBookmarlTotalSupply)
        return int(currentBookmarlTotalSupply)
    except:
        print("error: " + str(currentBookmarlTotalSupply))

# Create your views here.

@api_view(['POST'])
def art(request, pk):

    req_data = request.body.decode('utf-8')
    body = json.loads(req_data)
    bookcontent = Books.objects.get(pk=pk)
    curserial_num = bookcontent.curserial_number
    datamine = bookcontent.datamine
    # curserial_num = re.sub(r'[^a-zA-Z0-9\.]', '', curserial_num)
    # datamine = re.sub(r'[^a-zA-Z0-9\.]', '', datamine)
    
    daedalusToken = request.GET.get('daedalusToken', '0')
    daedalusToken = re.sub(r'[^a-zA-Z0-9\.]', '', daedalusToken)

    msg = encode_defunct(text=body['msg'])
    signature = body['signature']
    sender = Web3.toChecksumAddress(web3.eth.account.recover_message(msg, signature=signature))

    temp = 0
    # bmsupply =  getBookmarkTotalSupply(bookcontent.bm_contract_address)
    cwd = os.getcwd()
    path = (cwd + '/static/BookTradable.json')
    contract_abi = json.load(open(path))
    bt_address = Web3.toChecksumAddress(bookcontent.bt_contract_address)
    bt_Contract = web3.eth.contract(address=bt_address, abi=contract_abi)
    token_cnt = bt_Contract.functions.balanceOf(Web3.toChecksumAddress(sender)).call()

    if (token_cnt > 0):
        temp += token_cnt

    hb_address = Web3.toChecksumAddress(bookcontent.hb_contract_address)
    hb_Contract = web3.eth.contract(address=hb_address, abi=contract_abi)
    htoken_cnt = hb_Contract.functions.balanceOf(Web3.toChecksumAddress(sender)).call()
    
    if (token_cnt > 0):
        temp += htoken_cnt
    
    for item in bookcontent.bm_listdata:
        bm_address = Web3.toChecksumAddress(bookcontent.bt_contract_address)
        bm_Contract = web3.eth.contract(address=bm_address, abi=contract_abi)
        bmtoken_cnt = bm_Contract.functions.balanceOf(Web3.toChecksumAddress(sender)).call()
        temp += bmtoken_cnt
        
    if ((temp > 0) & (sender != '')):
        # cur_num = bmsupply - 1
        content = bookcontent.content
        figure_content = ''
        # if(content.find("<figure") > 0):
        #     figure_content = content[content.index("<figure"): content.index("</figure>") + 9]
        #     content = content.replace('</p>', '\n')
        #     # temp_content = re.sub(CLEANR, '', content)
        # else:
        #     content = content.replace('</p>', '\n')
        #     # temp_content = re.sub(CLEANR, '', content)
        
        return Response({"content": content, "book_image": figure_content, "curserial_num": curserial_num})
    else:
        return Response({"content":"You are not token owner!!"})

@api_view(['POST'])
def myopenai(request):
    
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    content = body['message']
    apikey = body["apikey"]
    aiprice = AIpricemodel.objects.last()
    cwd = os.getcwd()
    if(aiprice):
        transferval = aiprice.aiprice
    else:
        transferval = 1

    try:
        userinfo = Apikey.objects.filter(api_key=apikey).first()
        user_id = userinfo.user
        wallet = Wallet.objects.get(user_id=user_id)
        data = WalletSerializer(wallet).data
        
        if(data['balance'] > transferval):
            WalletTransaction.objects.create(
                wallet = wallet,
                transaction_type = "transfer",
                amount = transferval,
                source = wallet,
                destination = wallet,
            )
            filename = user_id + time.time()
            inpath = (cwd + '/static/benji/input_' + filename + '.pickle')
            inputf = open(inpath)
            inputf.write(content)
            inputf.close()
            response = openai.Completion.create(
                model="text-davinci-003",
                prompt="Rewrite the following to highlight any grammar, spelling, or clarity issues with the narrative:" + content,
                temperature=0.7,
                max_tokens=256,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            outpath = (cwd + '/static/benji/output_' + filename + '.pickle')
            outf = open(outpath)
            outf.write(response["choices"][0]["text"].lstrip())
            outf.close()
            return JsonResponse({"content":response["choices"][0]["text"].lstrip(), "type":"message"}, safe=False)
        else:
            return JsonResponse({"content":"current balance", "type": "error"}, safe=False)
    except Apikey.DoesNotExist:
        return JsonResponse({"content":"not exist user", "type": "error"}, safe=False)
