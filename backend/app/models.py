from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=300,null=False,blank=False)
    is_completed= models.BooleanField(default=False)
    
    
    