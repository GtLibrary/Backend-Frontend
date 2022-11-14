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
    fields = ('id', 'title','image_url')
    books = Books.objects.all().only('id', 'title','image_url')
    data = BooksSerializer(books, context={"request": request}, many=True, fields = fields).data
    return Response(data)

@api_view(['GET'])
def getbookdatabyId(request, pk):
    fields = ('id', 'title','image_url', 'book_price', 'datamine', 'introduction', 'bookmark_price', 'bt_contract_address', 'bm_contract_address', 'hb_contract_address')
    book = Books.objects.filter(pk=pk).only('id', 'title','image_url', 'book_price', 'datamine', 'introduction', 'bookmark_price', 'bt_contract_address', 'bm_contract_address', 'hb_contract_address')
    data = BooksSerializer(book, context={"request": request}, many=True, fields = fields).data
    return Response(data)


@api_view(['GET'])
def getBookContentbyId(request, pk):
    content = Books.objects.get(pk=pk)
    return Response(content.content)
#
# Calulate the portential of the contract/work of art.
#
class Potential():

    def __init__(self, datamine, curserial_num, arttype, error_fingerprint, book_id):
        self.warning = "BETA! This is a work in progress.  Please report any bugs to the author: johnrraymond@yahoo.com."
        self.pk = book_id
        self.datamine = datamine
        self.curserial_num = curserial_num
        self.error_fingerprint = error_fingerprint

        self.page = Books.objects.get(pk=self.pk)

        self.arttype = arttype
        self.title = self.get_title()
        self.books = self.get_books()
        self.bookmarks = self.get_bookmarks()
        self.cost = self.get_cost()
        self.net = self.get_net()
        self.booksales = self.get_booksales()
        self.bookmark_sales = self.get_bookmarksales()
        self.sales = self.get_total_sales()

        self.startingpoint = self.page.start_point
        self.bookmarkprice = self.page.bookmark_price
        self.bookprice = self.page.book_price
        self.maxbooksupply = self.page.max_book_supply
        self.maxbookmarksupply = self.page.max_bookmark_supply

        self.hardbound = self.page.hardbound
        self.hardboundprice = self.page.hardbound_price
        self.hardboundfrom = self.page.hardbound_from

        self.authorwallet = self.page.author_wallet

        potential_name = datamine
        potential_symbol = datamine
        potential_bookRegistryAddress = marketPlaceAddress
        potential_baseuri = "https://greatlibrary.io/nft/"
        potential_burnable = "true"
        potential_maxmint = self.maxbookmarksupply
        potential_defaultprice = self.bookmarkprice
        potential_defaultfrom = self.startingpoint
        potential_mintTo = self.authorwallet
        #potential_whoFilePath = getWhoFilePath(self.datamine)coin

        print("potential_mintTo: " + potential_mintTo)

        self._name = potential_name
        self._symbol = potential_symbol
        self._bookRegistryAddress = potential_bookRegistryAddress
        self._baseuri = potential_baseuri
        self._burnable = potential_burnable
        self._maxmint = potential_maxmint
        self._defaultprice = potential_defaultprice
        self._defaultfrom = potential_defaultfrom
        self._mintTo = potential_mintTo
        #self._whoFilePath = potential_whoFilePath


    def get_bookprice(self):
        try:
            return int(self.page.book_price)
        except:
            self.warning = self.warning + "Using an average book price. "
            return 6

    def get_bookmarks(self):
        try:
            return int(self.page.max_bookmark_supply)
        except:
            self.warning = self.warning + "No maxbookmarksupply. "
            return 22222

    def get_books(self):
        try:
            return int(self.page.max_book_supply)
        except:
            self.warning = self.warning + "No maxbooksupply. "
            return 100000

    def get_title(self):

        if hasattr(self.page, "title"):
            return "Project is not in the database? ERROR code: SANITY CHECK: " + self.datamine

        return self.page.title
        

    def get_error_fingerprint(self):
        return self.error_fingerprint

    def get_datamine(self):
        return self.datamine

    def get_curserial_num(self):
        return self.curserial_num

    def get_work(self):
        if self.books == -1:
            self.warning = self.warning + "Using average work of ~130,000 tokens per book including bookmarks. "
            return 22222 + 100000       # Average Bookmarks + books

        return self.books + self.bookmarks

    def get_booksales(self):
        if self.books == -1:
            return 22222 * self.get_bookprice()           # Average Books * book price.

        return self.books * self.get_bookprice()      # Books * book price.

    def get_bookmarkprice(self):
        return 0                    # TODO: Get this from the database. 6 CB is the default price for a book/mark.
                                    # Effectively, 0 as long as the book is free at the same time as buying the bookmark.

    def get_bookmarksales(self):
        if self.books != -1:
            return 22222 * self.get_bookmarkprice()       # Average Bookmarks * book price.

        return self.bookmarks * self.get_bookmarkprice()      # Bookmarks * book price.

    def get_total_sales(self):
        total_sales = 0
        total_sales += self.get_booksales() 
        total_sales += self.get_bookmarksales()
        return total_sales

    def get_cost(self):
        cost = 350                      # Base cost of 350 Cultural Bits. For cover and bookmark art
        cost += 0.1 * self.get_work() # 0.1 CBs per unit of work.

        return cost

    def get_net(self):
        cost = self.get_cost() 
        roi = self.get_total_sales()
        net = roi - cost

        return net


def generate_bookcontractid(self, datamine):
    dataminedir = Books.datamine_path(datamine)
    whoFile = dataminedir + "/contractBT" + datamine + ".txt"
    print("whoFile: " + whoFile)
    if not os.path.exists(whoFile):
        minter = Minter(self, datamine, "BT", whoFile)
        return;
    else:
        f = open(whoFile, 'r')
        contractBM = f.read().strip()
        f.close()
        return contractBM

    return False

    #minter = MyFirstMinter(potential, datamine)
    #return minter.deployBookContract()

def generate_bookmarkcontractid(self, datamine):
    dataminedir = Books.datamine_path(datamine)
    whoFile = dataminedir + "/contractBM" + datamine + ".txt"
    print("whoFile: " + whoFile)
    if not os.path.exists(whoFile):
        minter = Minter(self, datamine, "BM", whoFile)
        return;
    else:
        f = open(whoFile, 'r')
        contractBM = f.read().strip()
        f.close()
        return contractBM

    return False

    #minter = MyFirstMinter(self, datamine)
    #minter.deployBookmarkContract()


def getbookmarkcontractid(self, datamine):
    dataminedir = Books.datamine_path(datamine)
    try:
        f = open(dataminedir + "/contractBM" + datamine + ".txt", "r")
        contractid = f.read().strip()
        return contractid.strip().lower()
    except:
        generate_bookmarkcontractid(self, datamine)
        f = open(dataminedir + "/contractBM" + datamine + ".txt", "r")
        contractid = f.read().strip()
        return contractid.strip().lower()
    return "unknowncontractid-GAMMA"


def getbookcontractid(potential, datamine):
    dataminedir = Books.datamine_path(datamine)

    try:
        f = open(dataminedir + "/contractBT" + datamine + ".txt", "r")
        bookcontractid = f.read().strip()
        f.close()
        return bookcontractid.lower();
    except:
        generate_bookcontractid(potential, datamine)
        f = open(dataminedir + "/contractBT" + datamine + ".txt", "r")
        bookcontractid = f.read().strip()
        f.close()
        return bookcontractid.lower()

    return "unknowncontractid-ALPHA"

def verifyRewards(bookmarkcontractid, bookcontractid):
    print("verifyRewards: " + str(bookmarkcontractid) + " " + str(bookcontractid))
    verified = getFromBackend(bookmarkcontractid + "/verifyrewards/" + bookcontractid) 
    return verified

fifoWrite = 0 # Zero means no fd
def getFifoWrite():
    writeFifo = os.environ["ALPHA_FIFO"]
    global fifoWrite
    if fifoWrite == 0:
        fifoWrite = os.open(writeFifo, os.O_WRONLY)
    return fifoWrite

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

# generate hardbound contract address
def generate_hardboundcontractid(self, datamine):
    dataminedir = Books.datamine_path(datamine)
    whoFile = dataminedir + "/contractHB" + datamine + ".txt"
    print("whoFile: " + whoFile)
    if not os.path.exists(whoFile):
        minter = Minter(self, datamine, "HB", whoFile)
        return;
    else:
        f = open(whoFile, 'r')
        contractBM = f.read().strip()
        f.close()
        return contractBM

    return False

    #minter = MyFirstMinter(potential, datamine)
    #return minter.deployHardboundContract()

# get hardbound contract address
def gethardboundcontractid(potential, datamine):
    dataminedir = Books.datamine_path(potential.datamine)

    try:
        f = open(dataminedir + "/contractHB" + potential.datamine + ".txt", "r")
        contractid = f.read().strip()
        f.close()
        return contractid.strip().lower()
    except:
        generate_hardboundcontractid(potential, datamine)
        f = open(dataminedir + "/contractHB" + potential.datamine + ".txt", "r")    
        contractid = f.read().strip()
        f.close()
        return contractid.strip().lower()

    return "HB-ALPHA-CONTRACTID"



def ownTheToken(potential, datamine, msg, signature, tokenid, daedalusToken=0):
    sender = moralis.getSender(msg, signature)
    print("sender: " + sender)

    contractid = getbookcontractid(potential, datamine)
    print("contractid: " + contractid)

    #tokenOwner = moralis.getTokenOwner(contractid, tokenid)
    #print(tokenOwner)
    #print("tokenOwner: " + tokenOwner)

    if moralis.isSenderAllowedBookAccess(contractid, msg, signature, tokenid, daedalusToken):
        potential.canAccessBook = True
        return True
    else:
        potential.canAccessBook = False
        return False

    potential.canAccessBook = False
    return False



def calculate_project_potential(datamine, curserial_num, arttype, book_id, returntype="object", error_fingerprint="SUCCESS"):
    potential = Potential(datamine, curserial_num, arttype, error_fingerprint, book_id)

    if returntype == "json":
        return json.dumps(potential.__dict__, default=lambda o: 'coded')

    return potential


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
    tokenid = request.GET.get('tokenid', 'default')

    bmsupply =  getBookmarkTotalSupply(bookcontent.bm_contract_address)
    
    if bmsupply == 0:
        bookmarkcontractid = bookcontent.bm_contract_address
        bookcontractid = bookcontent.bt_contract_address
        hardboundcontractid = bookcontent.hb_contract_address
        verifyRewards(bookmarkcontractid, bookcontractid)
        getBookmarkTotalSupply(bookmarkcontractid)
        
    if (tokenid == 'default'):
        tokenOwner = ''
    else:
        contract_abi = json.load(open('/home/john/bakerydemo/brownie/BookTradable.json'))
        myContract = web3.eth.contract(address=bookcontent.bt_contract_address, abi=contract_abi)
        tokenOwner = myContract.functions.ownerOf(tokenid).call()
        print("token owner ==========", tokenOwner)
    # sender = moralis.getSender(msg, signature)
    # bookcontractid = bookcontent.bt_contract_address
    # tokenOwner = moralis.getTokenOwner(bookcontractid, tokenid)
    # sender = ''
    # tokenOwner = ''

    if sender == tokenOwner:
        cur_num = bmsupply - 1
        content = bookcontent.content
        figure_content = content[content.index("<figure"): content.index("</figure>") + 9]
        temp_content = content.replace(figure_content, '').replace('<p>', '').replace('</p>', '')

        return Response({"content": temp_content, "book_image": figure_content})
    else:
        return Response({"content":"You are not token owner!!"})
