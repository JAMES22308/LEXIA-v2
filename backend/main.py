from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.chat import ChatRequest
from controllers.chat_controller import ask_question
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"python": "api is running"}


@app.post("/ask")
def ask(request: ChatRequest):
    return ask_question(request.userQuestion)