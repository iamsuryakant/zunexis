export async function POST(request: Request) {
  const { code, language, version = "*" } = await request.json();

  try {
    const response = await fetch(
      `${process.env.ZUNEXIS_API_URL}/api/v2/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          version,
          files: [
            {
              content: code,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      return Response.json(
        {
          status: "error",
          message: errorText,
        },
        { status: 500 },
      );
    }

    const result = await response.json();

    return Response.json({
      status: "success",
      data: result,
    });
  } catch (error: unknown) {

    const message = error instanceof Error ? error.message : "Execution failed";

    return Response.json(
      {
        status: "error",
        message,
      },
      { status: 500 },
    );
  }
}
