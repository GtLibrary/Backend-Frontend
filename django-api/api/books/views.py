from django.shortcuts import render
from api.books.serializers import BooksSerializer
from api.books.models import Books
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.books.moralis import Moralis

moralis = Moralis()

# Create your views here.
@api_view(['GET'])
def getbooklist(request):
    fields = ('id', 'title','image_url')
    books = Books.objects.all().only('id', 'title','image_url')
    data = BooksSerializer(books, context={"request": request}, many=True, fields = fields).data
    return Response(data)

@api_view(['GET'])
def getbookdatabyId(request, pk):
    fields = ('id', 'title','image_url', 'book_price', 'introduction')
    book = Books.objects.filter(pk=pk).only('id', 'title','image_url', 'book_price', 'introduction')
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

        self.page = Books.objects.filter(pk=self.pk)

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
        # potential_bookRegistryAddress = marketPlaceAddress
        potential_baseuri = "https://greatlibrary.io/nft/"
        potential_burnable = "true"
        potential_maxmint = self.maxbookmarksupply
        potential_defaultprice = self.bookmarkprice;
        potential_defaultfrom = self.startingpoint;
        potential_mintTo = self.authorwallet;
        #potential_whoFilePath = getWhoFilePath(self.datamine)coin

        print("potential_mintTo: " + potential_mintTo)

        self._name = potential_name
        self._symbol = potential_symbol
        # self._bookRegistryAddress = potential_bookRegistryAddress
        self._baseuri = potential_baseuri
        self._burnable = potential_burnable
        self._maxmint = potential_maxmint
        self._defaultprice = potential_defaultprice
        self._defaultfrom = potential_defaultfrom
        self._mintTo = potential_mintTo
        #self._whoFilePath = potential_whoFilePath


    def get_bookprice(self):
        try:
            return int(self.page[0].bookprice)
        except:
            self.warning = self.warning + "Using an average book price. "
            return 6

    def get_bookmarks(self):
        try:
            return int(self.page[0].maxbookmarksupply)
        except:
            self.warning = self.warning + "No maxbookmarksupply. "
            return 22222

    def get_books(self):
        try:
            return int(self.page[0].maxbooksupply)
        except:
            self.warning = self.warning + "No maxbooksupply. "
            return 100000

    def get_title(self):

        if len(self.page) == 0:
            return "Project is not in the database? ERROR code: SANITY CHECK: " + self.datamine

        return self.page[0].title
        

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
