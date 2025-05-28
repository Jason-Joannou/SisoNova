import boto3
import os
import io
from datetime import datetime, timedelta
from typing import Optional
from botocore.exceptions import ClientError, NoCredentialsError
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class SecureS3Service:
    """Secure S3 service using presigned URLs instead of public access"""
    
    def __init__(self):
        self.aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
        self.aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        self.aws_region = os.getenv('AWS_REGION', 'us-east-1')
        self.bucket_name = os.getenv('AWS_S3_BUCKET_NAME')
        
        if not all([self.aws_access_key_id, self.aws_secret_access_key, self.bucket_name]):
            raise ValueError("Missing required AWS S3 configuration. Check your .env file.")
        
        # Initialize S3 client
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            region_name=self.aws_region
        )
        
        # Verify bucket exists or create it (PRIVATE by default)
        self._ensure_private_bucket_exists()
    
    def _ensure_private_bucket_exists(self):
        """Ensure the S3 bucket exists as PRIVATE (no public access)"""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            logger.info(f"S3 bucket '{self.bucket_name}' exists and is accessible")
        except ClientError as e:
            error_code = int(e.response['Error']['Code'])
            if error_code == 404:
                # Bucket doesn't exist, create it as PRIVATE
                try:
                    if self.aws_region == 'us-east-1':
                        self.s3_client.create_bucket(Bucket=self.bucket_name)
                    else:
                        self.s3_client.create_bucket(
                            Bucket=self.bucket_name,
                            CreateBucketConfiguration={'LocationConstraint': self.aws_region}
                        )
                    logger.info(f"Created PRIVATE S3 bucket '{self.bucket_name}'")
                    
                    # Ensure bucket is private (block public access)
                    self._ensure_bucket_is_private()
                    
                except ClientError as create_error:
                    logger.error(f"Failed to create S3 bucket: {create_error}")
                    raise
            else:
                logger.error(f"Error accessing S3 bucket: {e}")
                raise
    
    def _ensure_bucket_is_private(self):
        """Ensure bucket blocks all public access"""
        try:
            self.s3_client.put_public_access_block(
                Bucket=self.bucket_name,
                PublicAccessBlockConfiguration={
                    'BlockPublicAcls': True,
                    'IgnorePublicAcls': True,
                    'BlockPublicPolicy': True,
                    'RestrictPublicBuckets': True
                }
            )
            logger.info("Ensured bucket is private with public access blocked")
        except ClientError as e:
            logger.warning(f"Failed to set public access block: {e}")
    
    async def upload_pdf_from_file_secure(self, file_path: str, user_id: int, report_type: str, 
                                         expiration_hours: int = 24) -> Optional[str]:
        """
        Upload PDF file to PRIVATE S3 and return presigned URL
        
        Args:
            file_path: Path to the PDF file on disk
            user_id: User ID for organizing files
            report_type: Type of report (expenses, incomes, etc.)
            expiration_hours: How many hours the presigned URL should be valid
            
        Returns:
            Presigned URL that expires after specified hours, or None if failed
        """
        try:
            # Generate unique S3 object name
            timestamp = int(datetime.now().timestamp())
            object_name = f"reports/{user_id}/{report_type}_report_{timestamp}.pdf"
            
            # Upload file to PRIVATE bucket (no ACL = private by default)
            self.s3_client.upload_file(
                file_path,
                self.bucket_name,
                object_name,
                ExtraArgs={
                    'ContentType': 'application/pdf',
                    'ContentDisposition': f'attachment; filename="{report_type}_report.pdf"',
                    # NO ACL = private by default
                    'Metadata': {
                        'user_id': str(user_id),
                        'report_type': report_type,
                        'generated_at': datetime.now().isoformat()
                    }
                }
            )
            
            # Generate presigned URL that expires
            presigned_url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration_hours * 3600  # Convert hours to seconds
            )
            
            logger.info(f"Successfully uploaded PDF to PRIVATE S3 with presigned URL: {object_name}")
            logger.info(f"Presigned URL expires in {expiration_hours} hours")
            return presigned_url
            
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            return None
        except NoCredentialsError:
            logger.error("AWS credentials not found")
            return None
        except ClientError as e:
            logger.error(f"Failed to upload PDF to S3: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error uploading to S3: {e}")
            return None
    
    async def upload_pdf_from_bytes_secure(self, pdf_bytes: bytes, user_id: int, report_type: str,
                                          expiration_hours: int = 24) -> Optional[str]:
        """
        Upload PDF from bytes to PRIVATE S3 and return presigned URL
        
        Args:
            pdf_bytes: PDF file content as bytes
            user_id: User ID for organizing files
            report_type: Type of report (expenses, incomes, etc.)
            expiration_hours: How many hours the presigned URL should be valid
            
        Returns:
            Presigned URL that expires after specified hours, or None if failed
        """
        try:
            # Generate unique S3 object name
            timestamp = int(datetime.now().timestamp())
            object_name = f"reports/{user_id}/{report_type}_report_{timestamp}.pdf"
            
            # Create file-like object from bytes
            pdf_file_obj = io.BytesIO(pdf_bytes)
            
            # Upload to PRIVATE bucket
            self.s3_client.upload_fileobj(
                pdf_file_obj,
                self.bucket_name,
                object_name,
                ExtraArgs={
                    'ContentType': 'application/pdf',
                    'ContentDisposition': f'attachment; filename="{report_type}_report.pdf"',
                    # NO ACL = private by default
                    'Metadata': {
                        'user_id': str(user_id),
                        'report_type': report_type,
                        'generated_at': datetime.now().isoformat()
                    }
                }
            )
            
            # Generate presigned URL
            presigned_url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration_hours * 3600
            )
            
            logger.info(f"Successfully uploaded PDF to PRIVATE S3 with presigned URL: {object_name}")
            return presigned_url
            
        except NoCredentialsError:
            logger.error("AWS credentials not found")
            return None
        except ClientError as e:
            logger.error(f"Failed to upload PDF to S3: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error uploading to S3: {e}")
            return None
    
    def generate_new_presigned_url(self, object_name: str, expiration_hours: int = 24) -> Optional[str]:
        """
        Generate a new presigned URL for an existing object
        
        Args:
            object_name: S3 object key
            expiration_hours: Hours until expiration
            
        Returns:
            New presigned URL or None if failed
        """
        try:
            presigned_url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration_hours * 3600
            )
            
            logger.info(f"Generated new presigned URL for {object_name}")
            return presigned_url
            
        except ClientError as e:
            logger.error(f"Failed to generate presigned URL: {e}")
            return None
    
    async def delete_file(self, object_name: str) -> bool:
        """
        Delete file from S3 using object name
        
        Args:
            object_name: S3 object key (not URL)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=object_name
            )
            
            logger.info(f"Successfully deleted file from S3: {object_name}")
            return True
            
        except ClientError as e:
            logger.error(f"Failed to delete file from S3: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error deleting from S3: {e}")
            return False
    
    async def cleanup_old_files(self, days_old: int = 7):
        """Delete files older than specified days"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days_old)
            
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix='reports/'
            )
            
            if 'Contents' not in response:
                logger.info("No files found for cleanup")
                return
            
            deleted_count = 0
            for obj in response['Contents']:
                if obj['LastModified'].replace(tzinfo=None) < cutoff_date:
                    self.s3_client.delete_object(
                        Bucket=self.bucket_name,
                        Key=obj['Key']
                    )
                    deleted_count += 1
            
            logger.info(f"Cleaned up {deleted_count} old files from S3")
            
        except ClientError as e:
            logger.error(f"Failed to cleanup old files: {e}")
        except Exception as e:
            logger.error(f"Unexpected error during cleanup: {e}")