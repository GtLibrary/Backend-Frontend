from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import BooksSerializer
from .models import Books
from web3 import Web3, HTTPProvider
import os
import json
from api.books.permissions import IsStaff
from dotenv import load_dotenv
load_dotenv()

web3 = Web3(Web3.HTTPProvider(os.environ["speedyNode"]))
class BooksCreateApi(generics.CreateAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        cwd = os.getcwd()
        path = (cwd + '/static/PrintingPress.json')
        contract_abi = json.load(open(path))
        bt_contract_address = Web3.toChecksumAddress(request.data.get('bt_contract_address'))
        hb_contract_address = Web3.toChecksumAddress(request.data.get('hb_contract_address'))
        printpress = Web3.toChecksumAddress(os.environ['printingPressAddress'])
        printpress_Contract = web3.eth.contract(address=printpress, abi=contract_abi)
        check_book = printpress_Contract.functions.isOurContact(bt_contract_address).call()
        check_hardbound = printpress_Contract.functions.isOurContact(hb_contract_address).call()
        error_messages = "not our book."
        if not check_book:
            return Response({'errors': error_messages}, status=status.HTTP_400_BAD_REQUEST)
        if not check_hardbound:
            return Response({'errors': error_messages}, status=status.HTTP_400_BAD_REQUEST)

        bm_listdata = json.loads(request.data.get('bm_listdata'))
        for item in bm_listdata:
            bm_contract_address = Web3.toChecksumAddress(item['item_bmcontract_address'])
            check_bookmark = printpress_Contract.functions.isOurContact(bm_contract_address).call()
            if not check_bookmark:
                return Response({'errors': error_messages}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer_class):
        serializer_class.save(user=self.request.user)

class BooksApi(generics.ListAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

    def get_queryset(self):
        if(self.request.user.is_superuser):
            return Books.objects.all()
        else:
            return Books.objects.all().filter(user=self.request.user)

class BooksUpdateApi(generics.RetrieveUpdateAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

class BooksDeleteApi(generics.DestroyAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer