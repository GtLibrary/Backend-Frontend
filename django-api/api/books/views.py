import os
import re
import json
import requests
import base64
from django.shortcuts import render
from api.books.serializers import BooksSerializer
from api.books.models import Books
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.books.moralis import Moralis
from dotenv import load_dotenv
from api.books.minter import MyFirstMinter
from api.books.minter import MySecondMinter
from api.books.minter import Minter
from web3 import Web3, HTTPProvider

load_dotenv()

moralis = Moralis()

web3 = Web3(Web3.HTTPProvider(os.environ["speedyNode"]))
#os.environ['DJANGO_SETTINGS_MODULE']
securePort = os.environ['securePort']
secureHost = os.environ['secureHost']
cCAPrivateKey = os.environ['cCAPrivateKey']

marketPlaceAddress = os.environ['marketPlaceAddress']
if not marketPlaceAddress:
    #marketPlaceAddress = "0x0000000000000000000000000000000000000000"
    print("I dont have a marketPlaceAddress")

moralisdir = "/home/john/bakerydemo/moralis/"

# Create your views here.
@api_view(['GET'])
def getbooklist(request):
    fields = ('id', 'author_name', 'book_price', 'title','image_url')
    books = Books.objects.all().only('id', 'author_name', 'book_price', 'title','image_url')
    data = BooksSerializer(books, context={"request": request}, many=True, fields = fields).data
    return Response(data)

@api_view(['GET'])
def getbookdatabyId(request, pk):
    fields = ('id', 'title','image_url', 'author_name', 'book_price', 'datamine', 'introduction', 'bookmark_price', 'bt_contract_address', 'bm_contract_address', 'hb_contract_address', 'book_type_id')
    book = Books.objects.filter(pk=pk).only('id', 'title','image_url', 'book_price', 'datamine', 'introduction', 'bookmark_price', 'bt_contract_address', 'bm_contract_address', 'hb_contract_address', 'book_type_id')
    data = BooksSerializer(book, context={"request": request}, many=True, fields = fields).data
    return Response(data)


@api_view(['GET'])
def getBookContentbyId(request, pk):
    content = Books.objects.get(pk=pk)
    return Response(content.content)
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

@api_view(['GET'])
def art(request, pk):

    bookcontent = Books.objects.get(pk=pk)
    curserial_num = bookcontent.curserial_number
    curserial_num = re.sub(r'[^a-zA-Z0-9\.]', '', curserial_num)
    datamine = bookcontent.datamine
    datamine = re.sub(r'[^a-zA-Z0-9\.]', '', datamine)

    daedalusToken = request.GET.get('daedalusToken', '0')
    daedalusToken = re.sub(r'[^a-zA-Z0-9\.]', '', daedalusToken)

    msg = request.GET.get('msg', '')
    signature = request.GET.get('sig', 'default')
    sender = request.GET.get('sender', '')

    bmsupply =  getBookmarkTotalSupply(bookcontent.bm_contract_address)
    
    # if bmsupply == 0:
    #     bookmarkcontractid = bookcontent.bm_contract_address
    #     bookcontractid = bookcontent.bt_contract_address
    #     hardboundcontractid = bookcontent.hb_contract_address
    #     verifyRewards(bookmarkcontractid, bookcontractid)
    #     getBookmarkTotalSupply(bookmarkcontractid)
        
    contract_abi = json.load(open('/home/john/bakerydemo/brownie/BookTradable.json'))
    bt_address = Web3.toChecksumAddress(bookcontent.bt_contract_address)
    bt_Contract = web3.eth.contract(address=bt_address, abi=contract_abi)
    token_cnt = bt_Contract.functions.balanceOf(Web3.toChecksumAddress(sender)).call()

    if (token_cnt > 0) & (sender != ''):
        cur_num = bmsupply - 1
        content = bookcontent.content
        figure_content = content[content.index("<figure"): content.index("</figure>") + 9]
        temp_content = content.replace(figure_content, '').replace('<p>', '').replace('</p>', '')

        return Response({"content": temp_content, "book_image": figure_content, "curserial_num": curserial_num})
    else:
        return Response({"content":"You are not token owner!!"})
