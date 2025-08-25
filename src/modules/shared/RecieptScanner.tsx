import { useState, useRef, useCallback } from 'react';
import { Camera, X, CheckCircle, AlertCircle, Upload, Loader2 } from 'lucide-react';

const ReceiptScanner = ({
    onReceiptImageProcess,
    onError,
    className = "",
    showTitle = true,
    title = "Scannez votre facture",
    subtitle = "Scan your receipts and extract information automatically",
    captureButtonText = "Capture Photo",
    processButtonText = "Process Receipt",
    retakeButtonText = "Retake Photo",
    scanAnotherButtonText = "Scan Another Receipt",
    startScanButtonText = "Start Scanning"
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState('');
    const [permissionStatus, setPermissionStatus] = useState('prompt');
    const [isVideoReady, setIsVideoReady] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Handle errors internally and also notify parent if callback provided
    const handleError = useCallback((errorMessage) => {
        setError(errorMessage);
        if (onError) {
            onError(errorMessage);
        }
    }, [onError]);

    const checkCameraPermission = useCallback(async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.warn('Media Devices API not supported');
            setPermissionStatus('unsupported');
            return 'unsupported';
        }

        if (!window.isSecureContext) {
            console.warn('Insecure context - camera is blocked on most browsers (use HTTPS).');
            setPermissionStatus('insecure');
            return 'insecure';
        }

        if (navigator.permissions && navigator.permissions.query) {
            try {
                const perm = await navigator.permissions.query({ name: 'camera' });
                setPermissionStatus(perm.state);
                perm.onchange = () => setPermissionStatus(perm.state);
                return perm.state;
            } catch (e) {
                console.debug('Permissions API camera query failed or not supported:', e);
            }
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasVideoInput = devices.some(d => d.kind === 'videoinput');
            if (!hasVideoInput) {
                setPermissionStatus('notfound');
                return 'notfound';
            }
            const labelsAvailable = devices.some(d => d.label && d.label.length > 0);
            setPermissionStatus(labelsAvailable ? 'granted' : 'prompt');
            return labelsAvailable ? 'granted' : 'prompt';
        } catch (err) {
            console.warn('Failed to enumerate devices', err);
            setPermissionStatus('prompt');
            return 'prompt';
        }
    }, [setPermissionStatus]);

    const requestCameraAccess = useCallback(async () => {
        setError('');
        setIsVideoReady(false);

        if (!window.isSecureContext) {
            handleError('Camera requires a secure context (HTTPS or localhost).');
            setPermissionStatus('insecure');
            return;
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            handleError('Camera API not supported in this browser.');
            setPermissionStatus('unsupported');
            return;
        }

        try {
            let stream = null;

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: 'environment' },
                        // width: { ideal: 1280, min: 640 },
                        // height: { ideal: 1120, min: 480 }
                    },
                    audio: false
                });
            } catch (constraintErr) {
                console.info('Advanced constraints failed, falling back to basic video constraint.', constraintErr);
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            }

            setCameraStream(stream);
            setPermissionStatus('granted');
            setShowCamera(true);

            const setupVideo = () => {
                if (!videoRef.current) return;

                try { videoRef.current.setAttribute('playsinline', ''); } catch (e) { }
                try { videoRef.current.setAttribute('webkit-playsinline', ''); } catch (e) { }
                try { videoRef.current.muted = true; } catch (e) { }

                videoRef.current.srcObject = stream;
                try {
                    videoRef.current.load();
                } catch (e) { }

                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsVideoReady(true);
                            console.log('Video started playing');
                        })
                        .catch(playErr => {
                            console.warn('Initial play() failed, retrying once', playErr);
                            setTimeout(() => {
                                if (videoRef.current) {
                                    videoRef.current.play().catch(e => {
                                        console.error('Retry play failed:', e);
                                        setIsVideoReady(stream.getVideoTracks().length > 0);
                                    });
                                }
                            }, 300);
                        });
                } else {
                    setIsVideoReady(true);
                }
            };

            if (videoRef.current) setupVideo();
            else setTimeout(setupVideo, 200);

        } catch (err) {
            console.error('Camera access error:', err);
            if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                setPermissionStatus('denied');
                handleError('Camera permission denied. Please allow camera access in your browser or app settings.');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setPermissionStatus('notfound');
                handleError('No camera found on this device.');
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                setPermissionStatus('inuse');
                handleError('Camera is already in use by another application.');
            } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
                setPermissionStatus('constrained');
                handleError('No camera meets the requested constraints. Trying with basic settings failed.');
            } else {
                setPermissionStatus('error');
                handleError('Failed to access camera. Please try again.');
            }
        }
    }, [videoRef, setCameraStream, setPermissionStatus, handleError, setIsVideoReady, setShowCamera]);

    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setShowCamera(false);
        setIsVideoReady(false);
    }, [cameraStream]);

    const captureImage = useCallback(() => {
        console.log('Capture image clicked');

        if (!videoRef.current || !canvasRef.current) {
            console.error('Video or canvas ref not available');
            handleError('Unable to capture image. Please try again.');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error('Video has no dimensions:', video.videoWidth, 'x', video.videoHeight);
            handleError('Camera not ready. Please wait a moment and try again.');
            return;
        }

        console.log('Capturing image from video:', video.videoWidth, 'x', video.videoHeight);

        try {
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    console.log('Image captured successfully, blob size:', blob.size);
                    const imageUrl = URL.createObjectURL(blob);
                    console.log('Image URL created:', imageUrl);
                    setCapturedImage({ blob, url: imageUrl });
                    stopCamera();
                } else {
                    console.error('Failed to create blob from canvas');
                    handleError('Failed to capture image. Please try again.');
                }
            }, 'image/jpeg', 0.8);

        } catch (error) {
            console.error('Error capturing image:', error);
            handleError('Error capturing image. Please try again.');
        }
    }, [stopCamera, handleError]);

    const processImage = useCallback(async (imageBlob) => {
        setIsProcessing(true);
        setError('');

        try {
            // Call the parent's processing function
            if (onReceiptImageProcess) {
                await onReceiptImageProcess(imageBlob);
            }
        } catch (err) {
            console.error('Receipt processing error:', err);
            handleError(err.message || 'Failed to process receipt. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    }, [onReceiptImageProcess, handleError]);

    const resetScanner = useCallback(() => {
        if (capturedImage?.url) {
            URL.revokeObjectURL(capturedImage.url);
        }
        setCapturedImage(null);
        setError('');
        setIsProcessing(false);
        stopCamera();
    }, [capturedImage, stopCamera]);

    return (
        <div className={` flex flex-col flex-grow  ${className}`}>
            <div className=" -300 flex flex-col flex-grow ">
                {showTitle && (
                    <div className="text-center mb-8">
                        <h1 className="text-xl font-bold text-gray-50 mb-2">{title}</h1>
                        {/* <p className="text-gray-600">{subtitle}</p> */}
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                        <AlertCircle className="text-red-500 mt-0.5" size={20} />
                        <div>
                            <p className="text-red-800 font-medium">Error</p>
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Initial State - Start Scanning */}
                {!showCamera && !capturedImage && (
                    <div className="text-center bg-white rounded-lg">
                        <div className=" rounded-lg shadow-lg p-8 mb-6">
                            <Camera className="mx-auto mb-4 text-blue-500" size={64} />

                            <button
                                onClick={async () => {
                                    await checkCameraPermission();
                                    await requestCameraAccess();
                                }}
                                disabled={permissionStatus === 'denied'}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors"
                            >
                                <Camera size={20} />
                                <span>{startScanButtonText}</span>
                            </button>
                            {permissionStatus === 'denied' && (
                                <p className="text-red-600 text-sm mt-2">
                                    Camera access is required. Please enable it in your browser settings.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Camera View */}
                {showCamera && (
                    <div className="rounded-lg shadow-lg flex-grow flex flex-col  ">
                        {/* <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={stopCamera}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                <X size={24} />
                            </button>
                        </div> */}

                        <div className="relative flex flex-grow flex-col ">
                            <video
                                ref={videoRef}
                                autoPlay

                                playsInline
                                muted
                                className="w-full rounded bg-gray-900 flex-grow object-cover"
                                // style={{ maxHeight: '730px', minHeight: '730px' }}
                                onLoadedMetadata={(e) => {
                                    console.log('Video metadata loaded', e.target.videoWidth, 'x', e.target.videoHeight);
                                    if (videoRef.current) {
                                        const playPromise = videoRef.current.play();
                                        if (playPromise !== undefined) {
                                            playPromise.then(() => {
                                                console.log('Video playing from metadata event');
                                                setIsVideoReady(true);
                                            }).catch(error => {
                                                console.error('Play from metadata failed:', error);
                                            });
                                        }
                                    }
                                }}
                                onCanPlay={() => {
                                    console.log('Video can play');
                                    setIsVideoReady(true);
                                    if (videoRef.current && videoRef.current.paused) {
                                        videoRef.current.play().catch(error => {
                                            console.error('Play from canplay failed:', error);
                                        });
                                    }
                                }}
                                onPlaying={() => {
                                    console.log('Video is now playing');
                                    setIsVideoReady(true);
                                }}
                                onError={(e) => {
                                    console.error('Video error:', e);
                                    handleError('Error loading camera feed. Please try again.');
                                }}
                                onLoadStart={() => {
                                    console.log('Video load started');
                                }}
                            />

                            <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg pointer-events-none opacity-70"></div>

                            {!isVideoReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
                                    <div className="text-white text-center">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                                        <p>Loading camera...</p>
                                        <button
                                            onClick={() => {
                                                console.log('Manual video setup triggered');
                                                if (videoRef.current && cameraStream) {
                                                    videoRef.current.srcObject = cameraStream;
                                                    videoRef.current.load();
                                                    videoRef.current.play().then(() => {
                                                        setIsVideoReady(true);
                                                    }).catch(console.error);
                                                }
                                            }}
                                            className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-sm"
                                        >
                                            Retry Camera
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => {
                                    console.log('Capture button clicked, video ready:', isVideoReady);
                                    captureImage();
                                }}
                                disabled={!isVideoReady}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2 transition-colors"
                            >
                                <Camera size={20} />
                                <span>{captureButtonText}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Captured Image Preview */}
                {capturedImage && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Review Your Photo</h2>
                            <button
                                onClick={resetScanner}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                disabled={isProcessing}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="text-center">
                            <img
                                src={capturedImage.url}
                                alt="Captured receipt"
                                className="max-w-full max-h-96 mx-auto rounded-lg shadow-md mb-4"
                            />

                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => {
                                        console.log('Process receipt button clicked');
                                        processImage(capturedImage.blob);
                                    }}
                                    disabled={isProcessing}
                                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            <span>{processButtonText}</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        console.log('Retake photo clicked');
                                        if (capturedImage?.url) {
                                            URL.revokeObjectURL(capturedImage.url);
                                        }
                                        setCapturedImage(null);
                                        requestCameraAccess();
                                    }}
                                    disabled={isProcessing}
                                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {retakeButtonText}
                                </button>
                            </div>
                        </div>

                        {/* Success message and scan another button */}
                        {!isProcessing && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={resetScanner}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {scanAnotherButtonText}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default ReceiptScanner

// Demo component showing how to use the reusable ReceiptScanner
const ReceiptScannerDemo = () => {
    const [processedReceipts, setProcessedReceipts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock receipt processing function that the parent provides
    const handleReceiptImageProcess = async (imageBlob) => {
        setIsProcessing(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate random success/failure (80% success rate)
            const isSuccess = Math.random() > 0.2;

            if (!isSuccess) {
                throw new Error('Image quality too poor. Please retake the photo with better lighting and focus.');
            }

            // Simulate successful receipt processing
            const fakeReceiptData = {
                id: Date.now(),
                store: 'SuperMart Express',
                address: '123 Main Street, City Center',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                receiptNumber: `R${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
                items: [
                    { name: 'Organic Bananas', quantity: 2, price: 3.98 },
                    { name: 'Whole Milk 1L', quantity: 1, price: 2.49 },
                    { name: 'Bread - Whole Wheat', quantity: 1, price: 2.99 },
                    { name: 'Greek Yogurt', quantity: 3, price: 5.97 },
                    { name: 'Chicken Breast 1kg', quantity: 1, price: 12.99 }
                ],
                subtotal: 28.42,
                tax: 2.27,
                total: 30.69,
                paymentMethod: 'Credit Card',
                cashier: 'Employee #' + Math.floor(Math.random() * 100),
                processedAt: new Date().toISOString()
            };

            // Add to processed receipts list
            setProcessedReceipts(prev => [fakeReceiptData, ...prev]);

            console.log('Receipt processed successfully:', fakeReceiptData);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleError = (errorMessage) => {
        console.error('Receipt Scanner Error:', errorMessage);
        // You could show a toast notification here or handle the error in other ways
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="grid lg:grid-cols-2 gap-6 h-screen">
                {/* Receipt Scanner */}
                <div className="overflow-y-auto">
                    <ReceiptScanner
                        onReceiptImageProcess={handleReceiptImageProcess}
                        onError={handleError}
                        className="min-h-0 bg-white"
                        showTitle={true}
                        title="Smart Receipt Scanner"
                        subtitle="Scan and digitize your receipts instantly"
                        startScanButtonText="Start Scanning Receipt"
                        processButtonText="Extract Receipt Data"
                    />
                </div>

                {/* Processed Receipts Display */}
                <div className="p-6 overflow-y-auto bg-white">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Processed Receipts ({processedReceipts.length})
                    </h2>

                    {isProcessing && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center space-x-3">
                            <Loader2 className="animate-spin text-blue-500" size={20} />
                            <div>
                                <p className="text-blue-800 font-medium">Processing Receipt</p>
                                <p className="text-blue-600 text-sm">Extracting data from your image...</p>
                            </div>
                        </div>
                    )}

                    {processedReceipts.length === 0 && !isProcessing && (
                        <div className="text-center py-12">
                            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-500">No receipts processed yet.</p>
                            <p className="text-gray-400 text-sm">Scan a receipt to get started!</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {processedReceipts.map((receipt) => (
                            <div key={receipt.id} className="bg-gray-50 rounded-lg p-4 border">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{receipt.store}</h3>
                                        <p className="text-sm text-gray-600">{receipt.date} • {receipt.time}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-green-600">${receipt.total.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">#{receipt.receiptNumber}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-3">
                                    <p className="text-sm text-gray-600 mb-2">{receipt.items.length} items purchased</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">Subtotal:</span> ${receipt.subtotal.toFixed(2)}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Tax:</span> ${receipt.tax.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
