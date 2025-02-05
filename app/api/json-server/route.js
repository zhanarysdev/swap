import jsonServer from "json-server";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Define the path to the JSON database
const dbPath = path.join(process.cwd(), "db.json");

export async function GET() {
  try {
    const dbContent = await fs.readFile(dbPath, "utf8");
    return NextResponse.json(JSON.parse(dbContent));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read the database file." },
      { status: 500 }
    );
  }
}
