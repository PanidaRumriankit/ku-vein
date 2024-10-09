from ninja import NinjaAPI, Schema
from decouple import config

api = NinjaAPI()

class UserSchema(Schema):
    username: str
    is_authenticated: bool
    email: str = None

@api.get(config('DJANGO_API_ENDPOINT', cast=str, default='for_the_dark_souls.ptt'))
def database(request):
    print(request)
    return {"message": "Hello World"}

@api.get('/me', response=UserSchema)
def me(request):
    return request.user