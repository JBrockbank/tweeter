import { S3DAO } from "../interfaces/S3DAO";
import {
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "node:stream";

export class S3DAODynamo implements S3DAO {
    private readonly bucket = "tweeter-jtbrock";
    private readonly region = "us-east-1";
  
    async putImage(
      fileName: string,
      imageStringBase64Encoded: string,
    ): Promise<string> {
      let decodedImageBuffer: Buffer = Buffer.from(
        imageStringBase64Encoded,
        "base64",
      );
      const s3Params = {
        Bucket: this.bucket,
        Key: "image/" + fileName,
        Body: decodedImageBuffer,
        ContentType: "image/png",
        ACL: ObjectCannedACL.public_read,
      };
      const c = new PutObjectCommand(s3Params);
      const client = new S3Client({ region: this.region });
      try {
        await client.send(c);
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${fileName}`;
      } catch (error) {
        throw Error("s3 put image failed with: " + error);
      }
    }
  
    public async getImage(fileName: string) {
      const client = new S3Client({ region: this.region });
      const params = {
        Bucket: this.bucket,
        Key: "image/" + fileName,
      };
      const command = new GetObjectCommand(params);
      const response = await client.send(command);
  
      // The `Body` in the response is a readable stream
      const streamToString = (stream: Readable) =>
        new Promise<string>((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
          stream.on("error", reject);
        });
  
      return streamToString(response.Body as Readable);
    }
  }