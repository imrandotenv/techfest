'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { PdfMergeFile, PdfMergeResult } from '../types';

export function PdfMerger() {
  const [files, setFiles] = useState<PdfMergeFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mergedResult, setMergedResult] = useState<PdfMergeResult | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Process incoming files
  const handleAddFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    setMergedResult(null);

    const pdfFiles = Array.from(fileList).filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      setErrorMessage('Please select valid PDF documents (.pdf).');
      return;
    }

    setIsProcessing(true);
    setLoadingStatus('Reading PDF headers and page counts...');

    const newEntries: PdfMergeFile[] = [];

    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const loadedPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = loadedPdf.getPageCount();

        newEntries.push({
          id: `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          size: file.size,
          pageCount: count,
          file,
        });
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        setErrorMessage(
          `Unable to parse "${file.name}". The document might be password-encrypted or corrupt.`
        );
      }
    }

    setFiles((prev) => [...prev, ...newEntries]);
    setIsProcessing(false);
    setLoadingStatus('');
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // Reordering
  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
    setMergedResult(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedResult(null);
  };

  const clearAll = () => {
    setFiles([]);
    setMergedResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Execute Merge using pdf-lib
  const handleMergePdfs = async () => {
    if (files.length < 2) {
      setErrorMessage('Please add at least 2 PDF documents to merge.');
      return;
    }

    try {
      setIsProcessing(true);
      setLoadingStatus('Creating new PDF document in browser memory...');
      setErrorMessage(null);

      const mergedPdf = await PDFDocument.create();

      let pageTally = 0;
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setLoadingStatus(`Merging document ${i + 1} of ${files.length}: ${item.name}...`);
        
        const arrayBuffer = await item.file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        pageTally += copiedPages.length;
      }

      setLoadingStatus('Finalizing merged PDF bytes...');
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const fileName = `SETGOI_Merged_${timestamp}.pdf`;

      setMergedResult({
        url,
        blob,
        fileName,
        totalPages: pageTally,
        fileSizeBytes: blob.size,
      });

      // Auto trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsProcessing(false);
      setLoadingStatus('');
    } catch (err: any) {
      console.error('Merge failure:', err);
      setIsProcessing(false);
      setLoadingStatus('');
      setErrorMessage(`PDF Merge failed: ${err?.message || 'Unknown processing error.'}`);
    }
  };

  const totalPages = files.reduce((acc, f) => acc + f.pageCount, 0);
  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Client-Side PDF Document Merger
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Merge lecture notes, PYQ solution sets, and assignment sheets entirely within your local browser using <code className="font-mono text-zinc-700">pdf-lib</code>.
          </p>
        </div>

        {/* Privacy Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-800 text-xs font-medium self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Client-Side Privacy: 0 Bytes uploaded to server</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Processing Warning</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Upload Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-sky-500 bg-sky-50/50'
            : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800">
              Click to select or drag & drop PDF documents here
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Supports multiple files (PYQs, Notes, Certificates). Files remain strictly on your machine.
            </p>
          </div>
        </div>
      </div>

      {/* Loading Bar */}
      {isProcessing && (
        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 text-xs flex items-center gap-3">
          <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
          <span className="font-medium text-sky-800">{loadingStatus}</span>
        </div>
      )}

      {/* Merged Success Banner */}
      {mergedResult && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">PDF Merge Complete & Downloaded!</p>
              <p className="text-emerald-700 mt-0.5">
                {mergedResult.fileName} • {mergedResult.totalPages} pages • {formatBytes(mergedResult.fileSizeBytes)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={mergedResult.url}
              download={mergedResult.fileName}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Again
            </a>
            <a
              href={mergedResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-medium text-xs transition-colors"
            >
              Open in Tab
            </a>
          </div>
        </div>
      )}

      {/* Files List & Reorder Board */}
      {files.length > 0 && (
        <div className="border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-sm">
          {/* Header Bar */}
          <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-zinc-900">{files.length} Files Queued</span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-600">{totalPages} Total Pages</span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-600">{formatBytes(totalBytes)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearAll}
                className="text-zinc-500 hover:text-zinc-800 inline-flex items-center gap-1 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
              <button
                onClick={handleMergePdfs}
                disabled={isProcessing || files.length < 2}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                Merge All ({files.length})
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-zinc-100">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {file.pageCount} {file.pageCount === 1 ? 'page' : 'pages'} • {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                {/* Actions: Reorder and Remove */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveFile(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400 hover:bg-zinc-100 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400 hover:bg-zinc-100 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-zinc-200 mx-1" />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
