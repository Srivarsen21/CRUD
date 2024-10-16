from django.urls import path
from . import views as v


urlpatterns = [
    path("",v.task_list,name='main'),
    path('create',v.create_task,name='c'),
    path('delete/<str:id>',v.delete_task,name='d'),
    path('update/<str:id>',v.update_task,name='u'),
    path('getData/<str:id>',v.get_task,name='r')
    
]
