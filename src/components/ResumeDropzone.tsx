import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

interface ResumeDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export function ResumeDropzone({ onFileSelect, selectedFile }: ResumeDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/pdf' || file.type === 'text/plain') {
          onFileSelect(file);
        } else {
          alert('Please upload a valid PDF or TXT file.');
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ease-in-out cursor-pointer ${
        isDragActive
          ? 'border-fuchsia-500 bg-fuchsia-500/10'
          : selectedFile
          ? 'border-emerald-500/50 bg-emerald-500/5'
          : 'border-gray-200 hover:border-fuchsia-400 hover:bg-gray-50'
      }`}
    >
      <input
        type="file"
        accept=".pdf,.txt"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
        title=""
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {selectedFile ? (
          <>
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex flex-col items-center justify-center shadow-inner">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={`h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-inner transition-colors duration-200 ${isDragActive ? 'bg-fuchsia-100' : 'bg-gray-100'}`}>
              {isDragActive ? (
                <UploadCloud className="h-8 w-8 text-fuchsia-600" />
              ) : (
                <FileText className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Drag & drop your resume here
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports .PDF and .TXT up to 5MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
