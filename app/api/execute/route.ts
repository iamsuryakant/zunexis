export async function POST(request: Request) {
    const {source_code, language_id, stdin} = await request.json();

    const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_code,
                language_id,
                stdin: stdin || "",
            })
        }
    );

    const result = await response.json();

    return Response.json(result);
}