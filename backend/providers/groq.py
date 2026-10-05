import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_groq(question):
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "user",
                    "content": question
                }
            ]
        )

        return {
            "answer": response.choices[0].message.content,
            "provider": "groq"
        }

    except:
        return None