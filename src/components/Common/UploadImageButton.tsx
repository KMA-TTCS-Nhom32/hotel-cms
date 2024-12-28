import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Trash } from 'lucide-react';

interface UploadImageButtonProps {
  initialImage?: string;
  onImageChange?: (file: File | undefined) => void;
  className?: string;
}

const createObjectURL = (file: File): string => {
  if (typeof window === 'undefined') return '';
  return URL.createObjectURL(file);
};

export function UploadImageButton({
  initialImage,
  onImageChange,
  className = '',
}: Readonly<UploadImageButtonProps>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clean up the object URL when the component unmounts or when the file changes
    return () => {
      if (previewUrl && !initialImage) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, initialImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setPreviewUrl(createObjectURL(selectedFile));
      onImageChange?.(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange?.(undefined);
  };

  return (
    <div className={className}>
      <input
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        ref={fileInputRef}
        className='hidden'
      />
      {previewUrl && (
        <div className='relative w-fit mb-4'>
          <img
            src={previewUrl}
            alt='Preview'
            className='rounded-sm h-full max-h-28 min-h-10 w-auto'
          />
          <Button
            onClick={handleRemoveImage}
            type='button'
            variant='destructive'
            size='sm'
            className='absolute top-2 right-2'
          >
            <Trash className='w-6 h-6' />
          </Button>
        </div>
      )}
      <Button onClick={handleButtonClick} type='button' variant='outline' className='gap-3'>
        <Image className='w-6 h-6' />
        {previewUrl ? 'Đổi ảnh' : 'Chọn ảnh'}
      </Button>
    </div>
  );
}
