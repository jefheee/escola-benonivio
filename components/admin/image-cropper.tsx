'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { uploadMediaAction } from '@/app/(admin)/dashboard/actions/upload';
import { Check, Loader2, RefreshCw, X, Upload, Crop, Image as ImageIcon } from 'lucide-react';
import { validateAndSanitizeFile, validateImageDimensions } from '@/lib/storage-security';

interface ImageCropperProps {
  onUploadSuccess: (url: string) => void;
  aspectRatio?: number; // width / height, e.g. 16/9
  bucketName?: string;
  folderName?: string;
  label?: string;
}

export default function ImageCropper({
  onUploadSuccess,
  aspectRatio = 16 / 9,
  bucketName = 'escola_midias',
  folderName = 'banners',
  label = 'Adicionar Imagem'
}: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState<'original' | 'custom'>('original');
  const [selectedRatio, setSelectedRatio] = useState<number>(aspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sanitizedFilename, setSanitizedFilename] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Handle file selection with strict validation
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // 1. Validate File Size, MIME Type & Generate Secure Filename
      const valResult = validateAndSanitizeFile(file, 'image');
      if (!valResult.valid) {
        alert(valResult.error || 'Arquivo de imagem inválido.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setSelectedFile(file);
      setSanitizedFilename(valResult.sanitizedFilename || 'image.jpg');

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCropMode('original');
        setZoom(1);
        setXOffset(0);
        setYOffset(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw image on canvas in real-time when inputs change
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      // 2. Validate Image Bounds against Image Bomb / Pixel Flood Attacks
      const dimCheck = validateImageDimensions(img.naturalWidth, img.naturalHeight);
      if (!dimCheck.valid) {
        alert(dimCheck.error || 'Resolução da imagem excede os limites de segurança.');
        handleClose();
        return;
      }

      imgRef.current = img;
      draw();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, cropMode, selectedRatio, zoom, xOffset, yOffset]);

  const draw = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (cropMode === 'original') {
      // Proporção 100% natural até 1200px máx para preservar qualidade sem cortes
      const naturalRatio = img.naturalWidth / img.naturalHeight;
      const targetWidth = Math.min(img.naturalWidth, 1200);
      const targetHeight = Math.round(targetWidth / naturalRatio);

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    } else {
      // Recorte personalizado com a proporção selecionada
      const ratio = selectedRatio || aspectRatio || (16 / 9);
      const targetWidth = 800;
      const targetHeight = targetWidth / ratio;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.clearRect(0, 0, targetWidth, targetHeight);

      const imgWidth = img.width;
      const imgHeight = img.height;

      const scaleX = targetWidth / imgWidth;
      const scaleY = targetHeight / imgHeight;
      const baseScale = Math.max(scaleX, scaleY);
      
      const finalScale = baseScale * zoom;

      const drawWidth = imgWidth * finalScale;
      const drawHeight = imgHeight * finalScale;

      const dx = (targetWidth - drawWidth) / 2 + xOffset * 3;
      const dy = (targetHeight - drawHeight) / 2 + yOffset * 3;

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setSelectedFile(null);
    setSanitizedFilename('');
    setCropMode('original');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload to Supabase Storage using authenticated server action
  const handleUpload = async () => {
    if (!selectedFile || !sanitizedFilename) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('bucketName', bucketName);
      formData.append('folderName', folderName);
      formData.append('category', 'image');

      if (cropMode === 'original') {
        // Envia o arquivo original diretamente (sem recompressão e sem cortes)
        formData.append('file', selectedFile);

        const res = await uploadMediaAction(formData);
        if (!res.success || !res.url) {
          throw new Error(res.error || 'Falha ao enviar imagem.');
        }

        onUploadSuccess(res.url);
        handleClose();
      } else {
        // Envia imagem recortada do canvas
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas indisponível para recorte.');

        canvas.toBlob(async (blob) => {
          if (!blob) {
            setIsUploading(false);
            alert('Erro ao processar imagem para envio.');
            return;
          }

          try {
            formData.append('file', blob, 'imagem-recortada.jpg');
            const res = await uploadMediaAction(formData);

            if (!res.success || !res.url) {
              throw new Error(res.error || 'Falha ao enviar imagem.');
            }

            onUploadSuccess(res.url);
            handleClose();
          } catch (err: unknown) {
            console.error('[STORAGE SECURITY ERROR] Upload de imagem falhou:', err);
            alert(err instanceof Error ? err.message : 'Falha ao enviar imagem recortada.');
          } finally {
            setIsUploading(false);
          }
        }, 'image/jpeg', 0.88);
      }
    } catch (err: unknown) {
      console.error('[STORAGE SECURITY ERROR] Upload de imagem falhou:', err);
      alert(err instanceof Error ? err.message : 'Falha ao enviar imagem. Verifique o arquivo e tente novamente.');
    } finally {
      if (cropMode === 'original') {
        setIsUploading(false);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {/* Hidden native input */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {/* Primary Trigger Button */}
      <button
        type="button"
        onClick={triggerFileInput}
        className="flex items-center justify-center gap-2 border border-[#00185f] hover:bg-[#00185f]/5 text-[#00185f] text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-sm outline-none w-full sm:w-auto"
      >
        <Upload className="h-4 w-4 text-[#00185f]" />
        <span>{label}</span>
      </button>

      {/* Immediate Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-6 max-w-md w-full space-y-4 animate-scaleIn text-left">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-display font-extrabold text-[#00185f] text-sm">
                  Anexar Imagem
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Escolha manter a imagem íntegra ou aplicar um recorte.</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={isUploading}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setCropMode('original');
                  setZoom(1);
                  setXOffset(0);
                  setYOffset(0);
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all outline-none ${
                  cropMode === 'original'
                    ? 'bg-[#00185f] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Original (Sem Cortes)</span>
              </button>
              <button
                type="button"
                onClick={() => setCropMode('custom')}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all outline-none ${
                  cropMode === 'custom'
                    ? 'bg-[#00185f] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Crop className="h-3.5 w-3.5" />
                <span>Recortar / Ajustar</span>
              </button>
            </div>

            {/* Canvas / Preview Container */}
            <div className="relative border border-slate-200 bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center min-h-[160px] p-2">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto max-h-[220px] object-contain rounded"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  <span className="text-xs font-bold">Enviando imagem ao servidor...</span>
                </div>
              )}
            </div>

            {/* Mode Specific Controls */}
            {cropMode === 'original' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="leading-snug">
                  <strong>100% preservada:</strong> A imagem será enviada em sua proporção e resolução integral, sem nenhum corte ou perda de texto.
                </span>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                {/* Proportions selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Formato do Recorte</span>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                    {[
                      { label: '16:9', val: 16 / 9 },
                      { label: '4:3', val: 4 / 3 },
                      { label: '3:4', val: 3 / 4 },
                      { label: '1:1', val: 1 }
                    ].map((fmt) => (
                      <button
                        key={fmt.label}
                        type="button"
                        onClick={() => setSelectedRatio(fmt.val)}
                        className={`py-1 rounded border text-center transition-all ${
                          Math.abs(selectedRatio - fmt.val) < 0.01
                            ? 'bg-[#00185f] text-white border-[#00185f]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Aproximação (Zoom)</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.02"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    disabled={isUploading}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00185f] disabled:opacity-50"
                  />
                </div>

                {/* Horizontal Offset */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Ajuste Horizontal (X)</span>
                    <span>{xOffset}px</span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="1"
                    value={xOffset}
                    onChange={(e) => setXOffset(parseInt(e.target.value))}
                    disabled={isUploading}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00185f] disabled:opacity-50"
                  />
                </div>

                {/* Vertical Offset */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Ajuste Vertical (Y)</span>
                    <span>{yOffset}px</span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="1"
                    value={yOffset}
                    onChange={(e) => setYOffset(parseInt(e.target.value))}
                    disabled={isUploading}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00185f] disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 justify-end pt-2 border-t border-slate-100">
              <label className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 cursor-pointer transition-colors flex items-center gap-1.5 outline-none select-none disabled:opacity-50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Trocar</span>
              </label>

              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 outline-none"
              >
                <Check className="h-3.5 w-3.5" />
                <span>
                  {cropMode === 'original' ? 'Salvar Imagem Completa' : 'Aplicar Recorte & Salvar'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
