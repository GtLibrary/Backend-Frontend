from django.db import models

class Submission(models.Model):
    email = models.EmailField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    # Include any other fields relevant to the submission

    def __str__(self):
        return self.email
