const LEXIA_API_URL =
    'https://lexia-api-v2.onrender.com/ask';


export async function askLexia(
    question: string,
    code?: string,
    language?: string
): Promise<string> {

    const response = await fetch(
        LEXIA_API_URL,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                userQuestion: question,
                code: code,
                language: language
            })
        }
    );


    if (!response.ok) {

        throw new Error(
            `Backend returned ${response.status}`
        );
    }


    const data = await response.json() as {
        answer: string;
    };


    return data.answer;
}