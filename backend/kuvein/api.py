from ninja import NinjaAPI, Schema

api = NinjaAPI()

class UserSchema(Schema):
    username: str
    is_authenticated: bool
    email: str = None

@api.get("/hello")
def hello(request):
    print(request)
    return {"message": "Hello World"}

@api.get("/me", response=UserSchema)
def me(request):
    return request.user