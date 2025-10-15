import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || "general";
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (error, uploadResult) => {
      if (error) reject(error);
      else resolve(uploadResult);
    }).end(buffer);
  });

  return NextResponse.json(result);
}
