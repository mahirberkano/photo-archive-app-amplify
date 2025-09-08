import { NextResponse } from "next/server";
import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const TABLE_NAME = process.env.COMMENTS_TABLE || "comments";

// ✅ Yorum ekleme
export async function POST(req) {
  try {
    const body = await req.json();
    const { photoId, text, author } = body;

    if (!photoId || !text || !author) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
    }

    const commentId = uuidv4();
    const createdAt = new Date().toISOString();

    const params = {
      TableName: TABLE_NAME,
      Item: marshall({
        photoId,
        commentId,
        text,
        author,
        createdAt,
      }),
    };

    await dynamoDB.send(new PutItemCommand(params));

    return NextResponse.json({ success: true, commentId, createdAt });
  } catch (err) {
    console.error("Yorum ekleme hatası:", err);
    return NextResponse.json({ error: "Yorum eklenemedi" }, { status: 500 });
  }
}

// ✅ Fotoğrafın yorumlarını çekme
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const photoId = searchParams.get("photoId");

    console.log("📸 Yorum istenen photoId:", photoId);

    if (!photoId) {
      return NextResponse.json({ error: "photoId gerekli" }, { status: 400 });
    }

    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "photoId = :p",
      ExpressionAttributeValues: {
        ":p": { S: photoId },
      },
    };

    const command = new QueryCommand(params);
    const data = await dynamoDB.send(command);

    const comments = data.Items?.map((item) => unmarshall(item)) || [];
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(comments);
  } catch (err) {
    console.error("Yorumları alma hatası:", err);
    return NextResponse.json({ error: "Yorumlar alınamadı" }, { status: 500 });
  }
}
