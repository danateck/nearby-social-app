import { useEffect, useRef, useState } from 'react';

type StoryCameraModalProps = {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, mediaType: 'image' | 'video') => Promise<void>;
};

export default function StoryCameraModal({
  open,
  onClose,
  onUpload,
}: StoryCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [capturedType, setCapturedType] = useState<'image' | 'video' | null>(null);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;

    startCamera();

    return () => {
      stopCamera();
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [open, facingMode]);

  async function startCamera() {
    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function switchCamera() {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }

  function capturePhoto() {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `story-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      setCapturedFile(file);
      setCapturedType('image');
      setPreviewUrl(URL.createObjectURL(file));
    }, 'image/jpeg', 0.95);
  }

  function startRecording() {
    if (!streamRef.current) return;

    chunksRef.current = [];

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm',
    });

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const file = new File([blob], `story-${Date.now()}.webm`, {
        type: 'video/webm',
      });

      setCapturedFile(file);
      setCapturedType('video');
      setPreviewUrl(URL.createObjectURL(file));
      setRecording(false);
    };

    recorder.start();
    setRecording(true);

    timeoutRef.current = window.setTimeout(() => {
      stopRecording();
    }, 30000);
  }

  function stopRecording() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }

  function resetCapture() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setCapturedFile(null);
    setPreviewUrl('');
    setCapturedType(null);
  }

  async function handleUpload() {
    if (!capturedFile || !capturedType) return;

    try {
      setUploading(true);
      await onUpload(capturedFile, capturedType);
      resetCapture();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create story</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm"
            type="button"
          >
            Close
          </button>
        </div>

        {!capturedFile ? (
          <>
            <div className="overflow-hidden rounded-3xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-[420px] w-full object-cover"
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={switchCamera}
                type="button"
                className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium"
              >
                Flip camera
              </button>

              <button
                onClick={capturePhoto}
                type="button"
                className="rounded-2xl bg-pink-500 px-4 py-2 text-sm font-medium text-white"
              >
                Take photo
              </button>

              {!recording ? (
                <button
                  onClick={startRecording}
                  type="button"
                  className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-medium text-white"
                >
                  Record video
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  type="button"
                  className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white"
                >
                  Stop
                </button>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              Video stories are limited to 30 seconds.
            </p>
          </>
        ) : (
          <>
            <div className="overflow-hidden rounded-3xl bg-black">
              {capturedType === 'image' ? (
                <img
                  src={previewUrl}
                  alt="Captured story"
                  className="h-[420px] w-full object-cover"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="h-[420px] w-full object-cover"
                />
              )}
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={resetCapture}
                type="button"
                className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium"
              >
                Retake
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                type="button"
                className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload story'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}