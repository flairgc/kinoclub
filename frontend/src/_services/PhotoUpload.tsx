import React, { useState, ChangeEvent, FormEvent } from 'react';

export const PhotoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files && e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setUploadedUrl(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите файл.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setError(null);

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploading(false);

      if (!response.ok) {
        setError(result.error || 'Ошибка при загрузке.');
        return;
      }

      setUploadedUrl(result.url);
    } catch (err: any) {
      setUploading(false);
      setError(err.message || 'Ошибка сети.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Загрузить фотографию</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Выбранное фото"
            className="w-full h-auto rounded"
            style={{ width: 400 }}
          />
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </form>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-medium">Фото успешно загружено:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
};
