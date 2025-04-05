export interface S3DAO {
    putImage(
      fileName: string,
      imageStringBase64Encoded: string,
      imageFileExtension: string,
    ): Promise<string>;
    getImage(fileName: string): Promise<string>;
  }