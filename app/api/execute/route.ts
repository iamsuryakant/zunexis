export async function POST(request: Request) {
    const { source_code, language_id } = await request.json();

    try {
        const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_code,
                language_id,
            })
        });

        const result = await response.json();
        return Response.json(result);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to connect to execution service";
        return Response.json({ status: "error", message }, { status: 500 });
    }
}