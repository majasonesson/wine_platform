import { BlobServiceClient } from '@azure/storage-blob';

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  console.warn('Azure Storage connection string not configured');
}

/**
 * Upload a file to Azure Blob Storage
 */
export async function uploadImageToBlob(
  file: File,
  containerName: string = 'images'
): Promise<string> {
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error('Azure Storage not configured');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobName = `${Date.now()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
      blobContentDisposition: `inline; filename="${file.name}"`,
    },
  });

  console.log(`Successfully uploaded: ${blockBlobClient.url}`);
  return blockBlobClient.url;
}

/**
 * Upload document to Azure Blob Storage
 */
export async function uploadDocumentToBlob(file: File): Promise<string> {
  return uploadImageToBlob(file, 'documents');
}

/**
 * Upload certification to Azure Blob Storage
 */
export async function uploadCertificationToBlob(file: File): Promise<string> {
  return uploadImageToBlob(file, 'certifications');
}

