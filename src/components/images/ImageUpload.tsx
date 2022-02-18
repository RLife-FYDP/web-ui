import React from 'react';
import {
  authenticatedRequestWithBody,
} from "./../../api/apiClient";
import { FormInput } from '../authentication/FormInput';

interface UploadImageResponseJson {
  url: string
}

export const ImageUpload = (({ onImageUploaded = (_?: string) => {} }) => {

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await authenticatedRequestWithBody('/media/image/upload', formData)
      if (res?.status === 200) {
        const json: UploadImageResponseJson = await res.json()
        onImageUploaded(json.url)
      }
    } else {
      onImageUploaded()
    }
  };

  return (
    <div style={{width: '100%'}}>
        <FormInput
          type='file'
          label='Upload photo'
          accept='image/*'
          name='image'
          onChange={onSelectFile}
        />
    </div>
  );
});


export default ImageUpload;
