import qrcode
from PIL import Image, ImageDraw, ImageFont
import secrets
import os
from datetime import datetime, timedelta
from pathlib import Path

class QRCodeGenerator:
    def __init__(self, base_dir: str = "qr_codes"):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(exist_ok=True)
        
        # Create subdirectories for organization
        self.active_dir = self.base_dir / "active"
        self.expired_dir = self.base_dir / "expired"
        self.processed_dir = self.base_dir / "processed"
        
        for dir_path in [self.active_dir, self.expired_dir, self.processed_dir]:
            dir_path.mkdir(exist_ok=True)
    
    def generate_qr_code(
        self, 
        data: str, 
        transaction_id: str,
        size: int = 10,
        add_text: bool = True
    ) -> str:
        """Generate QR code with optional text overlay"""
        
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=size,
            border=4,
        )
        
        qr.add_data(data)
        qr.make(fit=True)
        
        # Create image with SisoNova colors
        qr_img = qr.make_image(
            fill_color="#654321",  # deep-brown
            back_color="#F4E4BC"   # sand
        ).convert('RGB')
        
        if add_text:
            qr_img = self._add_text_to_qr(qr_img, transaction_id)
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"sisonova_txn_{transaction_id}_{timestamp}.png"
        file_path = self.active_dir / filename
        
        # Save image
        qr_img.save(file_path, 'PNG', quality=95)
        
        return str(file_path)
    
    def _add_text_to_qr(self, qr_img: Image.Image, transaction_id: str) -> Image.Image:
        """Add SisoNova branding text to QR code"""
        
        # Create new image with extra space for text
        img_width, img_height = qr_img.size
        new_height = img_height + 80  # Extra space for text
        
        new_img = Image.new('RGB', (img_width, new_height), '#F4E4BC')
        new_img.paste(qr_img, (0, 0))
        
        # Add text
        draw = ImageDraw.Draw(new_img)
        
        try:
            # Try to use a nice font (you might need to adjust the path)
            font_large = ImageFont.truetype("arial.ttf", 16)
            font_small = ImageFont.truetype("arial.ttf", 12)
        except:
            # Fallback to default font
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # Add SisoNova branding
        brand_text = "SisoNova Transaction"
        brand_bbox = draw.textbbox((0, 0), brand_text, font=font_large)
        brand_width = brand_bbox[2] - brand_bbox[0]
        brand_x = (img_width - brand_width) // 2
        
        draw.text((brand_x, img_height + 10), brand_text, fill="#654321", font=font_large)
        
        # Add transaction ID
        txn_text = f"ID: {transaction_id[:12]}..."  # Truncate if too long
        txn_bbox = draw.textbbox((0, 0), txn_text, font=font_small)
        txn_width = txn_bbox[2] - txn_bbox[0]
        txn_x = (img_width - txn_width) // 2
        
        draw.text((txn_x, img_height + 35), txn_text, fill="#8B4513", font=font_small)
        
        # Add timestamp
        time_text = datetime.now().strftime("%Y-%m-%d %H:%M")
        time_bbox = draw.textbbox((0, 0), time_text, font=font_small)
        time_width = time_bbox[2] - time_bbox[0]
        time_x = (img_width - time_width) // 2
        
        draw.text((time_x, img_height + 55), time_text, fill="#8B4513", font=font_small)
        
        return new_img
    
    def move_to_expired(self, file_path: str) -> str:
        """Move QR code to expired directory"""
        source_path = Path(file_path)
        if source_path.exists() and source_path.parent == self.active_dir:
            dest_path = self.expired_dir / source_path.name
            source_path.rename(dest_path)
            return str(dest_path)
        return file_path
    
    def move_to_processed(self, file_path: str) -> str:
        """Move QR code to processed directory"""
        source_path = Path(file_path)
        if source_path.exists():
            dest_path = self.processed_dir / source_path.name
            source_path.rename(dest_path)
            return str(dest_path)
        return file_path
    
    def cleanup_expired_qr_codes(self, older_than_hours: int = 24):
        """Clean up old QR code files"""
        cutoff_time = datetime.now() - timedelta(hours=older_than_hours)
        
        for qr_file in self.expired_dir.glob("*.png"):
            if datetime.fromtimestamp(qr_file.stat().st_mtime) < cutoff_time:
                qr_file.unlink()  # Delete file
                print(f"Deleted expired QR code: {qr_file.name}")

# Initialize QR code generator
qr_generator = QRCodeGenerator()

# Example usage
data = "http://127.0.0.1:3000/api/v1/transactions/process_transaction"
transaction_id = "1234567890"
qr_file_path = qr_generator.generate_qr_code(data, transaction_id)