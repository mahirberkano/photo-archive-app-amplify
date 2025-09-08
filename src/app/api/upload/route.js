import { NextResponse } from 'next/server';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'us-east-1'
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { photoId, caption, fileName, uploadedBy } = body;

    console.log('Alınan veri:', body);

    // Gerekli alanların kontrolü
    if (!photoId || !fileName || !uploadedBy) {
      return NextResponse.json(
        { error: 'Eksik bilgi: photoId, fileName ve uploadedBy zorunludur' }, 
        { status: 400 }
      );
    }

    const params = {
      TableName: process.env.PHOTO_TABLE || 'dynamo1348a4e4-dev',
      Item: marshall({
        photoarchive: photoId,
        caption: caption || '', 
        fileName,
        uploadedBy,
        createdAt: new Date().toISOString()
      })
    };

    console.log('DynamoDB params:', params);

    await client.send(new PutItemCommand(params));
    
    console.log('DynamoDB kaydı başarılı');
    
    return NextResponse.json({ 
      success: true,
      message: 'Fotoğraf ve caption başarıyla kaydedildi',
      photoId 
    });
  } catch (error) {
    console.error('DynamoDB hatası:', error, error.stack);
    return NextResponse.json(
      { error: 'Fotoğraf kaydedilemedi: ' + error.message }, 
      { status: 500 }
    );
  }
}