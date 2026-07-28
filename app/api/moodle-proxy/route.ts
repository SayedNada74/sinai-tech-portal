import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch Moodle URL: status ${res.status}` }, { status: res.status });
    }
    const data = await res.text();
    return new NextResponse(data, {
      headers: { 
        "Content-Type": "text/calendar",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
