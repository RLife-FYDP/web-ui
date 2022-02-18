import React, { useState, useCallback, useRef, useEffect, forwardRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';

import { FormInput } from '../authentication/FormInput';

export const ImageCrop = (({ onImageUpdated = (_: HTMLCanvasElement) => {} }) => {
  const [upImg, setUpImg] = useState('');
  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Partial<Crop>>({ unit: '%', width: 30, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState<Partial<Crop> | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop: Partial<Crop> = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width ?? 0 * pixelRatio;
    canvas.height = crop.height ?? 0 * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x ?? 0 * scaleX,
      crop.y ?? 0 * scaleY,
      crop.width ?? 0 * scaleX,
      crop.height ?? 0* scaleY,
      0,
      0,
      crop.width ?? 0,
      crop.height ?? 0
    );
    onImageUpdated(previewCanvasRef.current)
  }, [completedCrop]);

  return (
    <div style={{width: '100%'}}>
      <div>
        <FormInput
          type='file'
          label='Upload photo'
          accept='image/*'
          name='image'
          onChange={onSelectFile}
        />
      </div>
      <ReactCrop
        style={{maxWidth: '100%'}}
        src={upImg}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={c => setCrop(c)}
        onComplete={c => {
          setCompletedCrop(c);
        }}
        ruleOfThirds
        minWidth={200}
        minHeight={200}
      />
      <div style={{ display: 'none' }}>
        <canvas
          ref={previewCanvasRef}
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0)
          }}
        />
      </div>
    </div>
  );
});


export default ImageCrop;
