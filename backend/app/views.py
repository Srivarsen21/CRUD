from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer
from rest_framework import status
import json
from django.shortcuts import redirect
@api_view(['GET'])
def task_list(request):
    try:
        if request.method =='GET':
            data = Task.objects.all()
            serializer = TaskSerializer(data,context={'request':request},many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message':e},status=status.HTTP_417_EXPECTATION_FAILED)
    
@api_view(['GET'])
def get_task(request,id):
    try:
        if request.method =='GET':
            data = Task.objects.get(id=id)
            if data:
                serializer = TaskSerializer(data,context={'request':request},many=False)
                return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                return Response({"message":f"No data in id with {id}"})
    except Exception as e:
        return Response({'message':e},status=status.HTTP_417_EXPECTATION_FAILED)
    
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from django.shortcuts import redirect
from .models import Task  

@api_view(['POST'])
def create_task(request):
   
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        try:
            data = json.loads(request.body)  
            title = data.get('title')  
            if not title:
                return Response({'message': 'Title is required'}, status=status.HTTP_400_BAD_REQUEST)
            
         
            task = Task.objects.create(title=title)
            task.save()

            return Response({"message": "Task saved successfully!"}, status=status.HTTP_201_CREATED)
        
       
        except json.JSONDecodeError as e:
            return Response({'message': f'JSON Decode Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)

    return redirect('main')

        
            
@api_view(['DELETE'])
def delete_task(request,id):
    if request.method == 'DELETE':
        try:
            data = Task.objects.get(id=id)
            data.delete()
            redirect('main')
            return Response({"message": "Task Deleted Successfully!"}, status=status.HTTP_200_OK)
        
        except json.JSONDecodeError as e:
            return Response({'message': f'JSON Decode Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
            
@api_view(['PUT'])
def update_task(request,id):
    if request.method=='PUT':
        try:
            updated_study = Task.objects.get(id=id)
            data = json.loads(request.body)
            updated_study.title= data['title']
            updated_study.is_completed =data['is_completed']
            updated_study.save()
            return Response({'message':'Task Updated Successfully'})
        except json.JSONDecodeError as e:
            return Response({"message":f"{str(e)}"})
            