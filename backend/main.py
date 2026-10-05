from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.chat import ChatRequest
from controllers.chat_controller import ask_question
app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"], //allowing localhost to connect
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# //allowing any website to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"python": "api is running"}


@app.post("/ask")
def ask(request: ChatRequest):
    return ask_question(request.userQuestion)