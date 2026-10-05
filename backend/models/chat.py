from pydantic import BaseModel


class ChatRequest(BaseModel):
    userQuestion: str

