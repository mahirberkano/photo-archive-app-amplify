import { NextResponse } from "next/server";
import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import awsExports from "@/aws-exports";

const dynamoDB = new DynamoDBClient({ region: awsExports.aws_project_region });
const s3 = new S3Client({
  region: awsExports.aws_user_files_s3_bucket_region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,  
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "username parametresi gerekli" },
        { status: 400 }
      );
    }

    let items = [];

    if (username === "all") {
      // 🔥 Tüm kayıtları getir
      const scanParams = {
        TableName: process.env.PHOTO_TABLE || "dynamo1348a4e4-dev",
      };
      const scanCommand = new ScanCommand(scanParams);
      const scanData = await dynamoDB.send(scanCommand);
      items = scanData.Items.map((item) => unmarshall(item));
    } else {
      // 🔥 Sadece belli kullanıcının fotoğrafları
      const params = {
        TableName: process.env.PHOTO_TABLE || "dynamo1348a4e4-dev",
        IndexName: "uploadedBy-index",
        KeyConditionExpression: "uploadedBy = :u",
        ExpressionAttributeValues: {
          ":u": { S: username },
        },
      };

      const queryCommand = new QueryCommand(params);
      const data = await dynamoDB.send(queryCommand);
      items = data.Items.map((item) => unmarshall(item));
    }

    // S3 pre-signed URL ekle
    const photosWithUrls = await Promise.all(
      items.map(async (photo) => {
        try {
          const command = new GetObjectCommand({
            Bucket: awsExports.aws_user_files_s3_bucket,
            Key: photo.fileName,
          });
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          return { ...photo, url };
        } catch (err) {
          console.error("S3 URL alınamadı:", err);
          return { ...photo, url: null };
        }
      })
    );

    // 🔥 feed için en yeni fotolar üstte olsun
    photosWithUrls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(photosWithUrls);
  } catch (err) {
    console.error("Hata:", err);
    return NextResponse.json(
      { error: "Fotoğraflar alınırken hata oluştu" },
      { status: 500 }
    );
  }
}
