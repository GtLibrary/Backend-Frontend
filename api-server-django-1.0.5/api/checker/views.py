from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from .models import Submission
from .tasks import process_manuscript  # Import your Celery task
from rest_framework.decorators import api_view

import os

@csrf_exempt
@api_view(['POST'])
def check_manuscript(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        manuscript = request.POST.get('manuscript')

        # Check if the email has exceeded its submission quota
        if check_quota(email):
            return JsonResponse({"error": "Submission quota exceeded"}, status=429)

        #os.system("pwd")
        #os.system("ls -al ./api/checker/chatapi.py")
        
        process_manuscript.delay(manuscript, email)
        #process_tester.delay()

        # Record the submission attempt
        Submission.objects.create(email=email)

        return JsonResponse({"message": "Manuscript submitted successfully."}, status=202)

    return JsonResponse({"error": "Invalid request"}, status=400)


def check_quota(email):                         # Defines the quota first...
    # Define the quota limit and timeframe
    quota_limit = 3       # FIXME: Add these to the .env
    quota_days = 3
    timeframe_start = timezone.now() - timedelta(days=quota_days)

    # Count submissions from this email within the timeframe
    recent_submissions_count = Submission.objects.filter(
        email=email, 
        submitted_at__gte=timeframe_start
    ).count()

    # Return True if the quota has been exceeded, False otherwise
    return recent_submissions_count >= quota_limit

