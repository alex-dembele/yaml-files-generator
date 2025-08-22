import { useState, useRef, useCallback } from 'react';
import { Camera, X, CheckCircle, AlertCircle, Upload, Loader2 } from 'lucide-react';

const HomePage = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [error, setError] = useState('');
    const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'granted', 'denied', 'prompt'
    const [isVideoReady, setIsVideoReady] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Check camera permission status
    // const checkCameraPermission = useCallback(async () => {
    //     try {
    //         if (navigator.permissions) {
    //             const permission = await navigator.permissions.query({ name: 'camera' });
    //             setPermissionStatus(permission.state);
    //             return permission.state;
    //         }
    //     } catch (err) {
    //         console.warn('Permission API not supported', err);
    //     }
    //     return 'prompt';
    // }, []);

    // // Request camera access
    // const requestCameraAccess = useCallback(async () => {
    //     setError('');
    //     setIsVideoReady(false);

    //     try {
    //         // Try with ideal constraints first
    //         let stream;
    //         try {
    //             stream = await navigator.mediaDevices.getUserMedia({
    //                 video: {
    //                     facingMode: { ideal: 'environment' },
    //                     width: { ideal: 1280, min: 640 },
    //                     height: { ideal: 720, min: 480 }
    //                 }
    //             });
    //         } catch (constraintErr) {
    //             // Fallback to basic settings if constraints fail
    //             console.log('Advanced constraints failed, trying basic camera...');
    //             stream = await navigator.mediaDevices.getUserMedia({
    //                 video: true
    //             });
    //         }

    //         setCameraStream(stream);
    //         setPermissionStatus('granted');
    //         setShowCamera(true);

    //         // Set up video stream immediately
    //         const setupVideo = () => {
    //             if (videoRef.current && stream) {
    //                 console.log('Setting up video stream...');
    //                 videoRef.current.srcObject = stream;

    //                 // Force video to load and play
    //                 videoRef.current.load();

    //                 const playPromise = videoRef.current.play();
    //                 if (playPromise !== undefined) {
    //                     playPromise
    //                         .then(() => {
    //                             console.log('Video started playing successfully');
    //                             setIsVideoReady(true);
    //                         })
    //                         .catch(error => {
    //                             console.error('Video play failed:', error);
    //                             // Try again after a short delay
    //                             setTimeout(() => {
    //                                 if (videoRef.current) {
    //                                     videoRef.current.play().catch(e => console.error('Retry play failed:', e));
    //                                 }
    //                             }, 500);
    //                         });
    //                 }
    //             }
    //         };

    //         // Setup video immediately if element exists, otherwise wait a bit
    //         if (videoRef.current) {
    //             setupVideo();
    //         } else {
    //             setTimeout(setupVideo, 200);
    //         }

    //     } catch (err) {
    //         console.error('Camera access error:', err);
    //         setPermissionStatus('denied');

    //         if (err.name === 'NotAllowedError') {
    //             setError('Camera permission denied. Please allow camera access in your browser settings.');
    //         } else if (err.name === 'NotFoundError') {
    //             setError('No camera found on this device.');
    //         } else if (err.name === 'NotReadableError') {
    //             setError('Camera is already in use by another application.');
    //         } else {
    //             setError('Failed to access camera. Please try again.');
    //         }
    //     }
    // }, []);

    // Assumes you have: videoRef, setPermissionStatus, setError, setIsVideoReady, setCameraStream, setShowCamera
    const checkCameraPermission = useCallback(async () => {
        // Quick platform checks
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.warn('Media Devices API not supported');
            setPermissionStatus('unsupported');
            return 'unsupported';
        }

        if (!window.isSecureContext) {
            // getUserMedia and real permission prompts usually require HTTPS (or localhost)
            console.warn('Insecure context - camera is blocked on most browsers (use HTTPS).');
            setPermissionStatus('insecure');
            return 'insecure';
        }

        // Try Permissions API if available (may throw if "camera" isn't recognized)
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const perm = await navigator.permissions.query({ name: 'camera' });
                setPermissionStatus(perm.state);
                // update if permission changes later
                perm.onchange = () => setPermissionStatus(perm.state);
                return perm.state;
            } catch (e) {
                // Some browsers (Safari) or older implementations throw; fall back below
                console.debug('Permissions API camera query failed or not supported:', e);
            }
        }

        // Fallback: use enumerateDevices to infer permission state:
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasVideoInput = devices.some(d => d.kind === 'videoinput');
            if (!hasVideoInput) {
                setPermissionStatus('notfound');
                return 'notfound';
            }
            // If device labels are present then permission was previously granted.
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

        // Must be secure and a user gesture triggered this function
        if (!window.isSecureContext) {
            setError('Camera requires a secure context (HTTPS or localhost).');
            setPermissionStatus('insecure');
            return;
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Camera API not supported in this browser.');
            setPermissionStatus('unsupported');
            return;
        }

        try {
            let stream = null;

            // Try ideal constraints first (environment facing)
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: 'environment' },
                        width: { ideal: 1280, min: 640 },
                        height: { ideal: 720, min: 480 }
                    },
                    audio: false
                });
            } catch (constraintErr) {
                // If advanced constraints fail, try a simpler one (broad compatibility)
                console.info('Advanced constraints failed, falling back to basic video constraint.', constraintErr);
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            }

            // Save stream and update UI state
            setCameraStream(stream);
            setPermissionStatus('granted');
            setShowCamera(true);

            // Attach stream to video element and ensure mobile-friendly attributes
            const setupVideo = () => {
                if (!videoRef.current) return;

                // Mobile Safari needs playsinline to avoid fullscreen/autoplay issues
                try { videoRef.current.setAttribute('playsinline', ''); } catch (e) { }
                try { videoRef.current.setAttribute('webkit-playsinline', ''); } catch (e) { }

                // Muted helps autoplay/play policies on some mobile browsers
                try { videoRef.current.muted = true; } catch (e) { }

                videoRef.current.srcObject = stream;
                // load + play
                try {
                    videoRef.current.load();
                } catch (e) { /* ignore */ }

                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsVideoReady(true);
                            console.log('Video started playing');
                        })
                        .catch(playErr => {
                            console.warn('Initial play() failed, retrying once', playErr);
                            // retry once after short delay (useful for some mobile quirks)
                            setTimeout(() => {
                                if (videoRef.current) {
                                    videoRef.current.play().catch(e => {
                                        console.error('Retry play failed:', e);
                                        // still consider stream ready if tracks exist
                                        setIsVideoReady(stream.getVideoTracks().length > 0);
                                    });
                                }
                            }, 300);
                        });
                } else {
                    // If play() returns undefined, mark as ready
                    setIsVideoReady(true);
                }
            };

            // If ref exists attach immediately, otherwise wait briefly
            if (videoRef.current) setupVideo();
            else setTimeout(setupVideo, 200);

        } catch (err) {
            console.error('Camera access error:', err);
            // Common error names: NotAllowedError, NotFoundError, NotReadableError, OverconstrainedError
            if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                setPermissionStatus('denied');
                setError('Camera permission denied. Please allow camera access in your browser or app settings.');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setPermissionStatus('notfound');
                setError('No camera found on this device.');
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                setPermissionStatus('inuse');
                setError('Camera is already in use by another application.');
            } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
                setPermissionStatus('constrained');
                setError('No camera meets the requested constraints. Trying with basic settings failed.');
            } else {
                setPermissionStatus('error');
                setError('Failed to access camera. Please try again.');
            }
        }
    }, [videoRef, setCameraStream, setPermissionStatus, setError, setIsVideoReady, setShowCamera]);


    // Stop camera stream
    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setShowCamera(false);
        // setCapturedImage(null);
        setIsVideoReady(false);
    }, [cameraStream]);

    // Capture image from video
    const captureImage = useCallback(() => {
        console.log('Capture image clicked');

        if (!videoRef.current || !canvasRef.current) {
            console.error('Video or canvas ref not available');
            setError('Unable to capture image. Please try again.');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Check if video is actually playing and has dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error('Video has no dimensions:', video.videoWidth, 'x', video.videoHeight);
            setError('Camera not ready. Please wait a moment and try again.');
            return;
        }

        console.log('Capturing image from video:', video.videoWidth, 'x', video.videoHeight);

        try {
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    console.log('Image captured successfully, blob size:', blob.size);
                    const imageUrl = URL.createObjectURL(blob);
                    console.log('Image URL created:', imageUrl);
                    setCapturedImage({ blob, url: imageUrl });
                    stopCamera();
                    // processReceipt(blob)
                } else {
                    console.error('Failed to create blob from canvas');
                    setError('Failed to capture image. Please try again.');
                }
            }, 'image/jpeg', 0.8);

        } catch (error) {
            console.error('Error capturing image:', error);
            setError('Error capturing image. Please try again.');
        }
    }, [stopCamera]);

    // Simulate API call for receipt processing
    const processReceipt = useCallback(async (imageBlob) => {
        setIsProcessing(true);
        setError('');
        setReceiptData(null);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate random success/failure (70% success rate)
            const isSuccess = Math.random() > 0.3;

            if (!isSuccess) {
                throw new Error('Image quality too poor. Please retake the photo with better lighting and focus.');
            }

            // Fake successful receipt data
            const fakeReceiptData = {
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
                cashier: 'Employee #' + Math.floor(Math.random() * 100)
            };

            setReceiptData(fakeReceiptData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    // Reset all states
    const resetScanner = useCallback(() => {
        // Clean up captured image URL to prevent memory leaks
        if (capturedImage?.url) {
            URL.revokeObjectURL(capturedImage.url);
        }

        setCapturedImage(null);
        setReceiptData(null);
        setError('');
        setIsProcessing(false);
        stopCamera();
    }, [capturedImage, stopCamera]);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Receipt Scanner</h1>
                    <p className="text-gray-600">Scan your receipts and extract information automatically</p>
                </div>

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

                {/* Main Content */}
                {!showCamera && !capturedImage && !receiptData && (
                    <div className="text-center">
                        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                            <Camera className="mx-auto mb-4 text-blue-500" size={64} />
                            <p className="text-gray-600 mb-6">
                                Take a photo of your receipt to extract and organize the information automatically.
                            </p>
                            <button
                                onClick={async () => {
                                    await checkCameraPermission();
                                    await requestCameraAccess();
                                }}
                                disabled={permissionStatus === 'denied'}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors"
                            >
                                <Camera size={20} />
                                <span>Start Scanning</span>
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
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Position your receipt in the frame</h2>
                            <button
                                onClick={stopCamera}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full rounded-lg bg-gray-900"
                                style={{ maxHeight: '500px', minHeight: '300px' }}
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
                                    setError('Error loading camera feed. Please try again.');
                                }}
                                onLoadStart={() => {
                                    console.log('Video load started');
                                }}
                            />

                            {/* Camera overlay for better framing */}
                            <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg pointer-events-none opacity-70"></div>

                            {/* Loading overlay if video not ready */}
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
                                <span>Capture Photo</span>
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
                                        processReceipt(capturedImage.blob);
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
                                            <span>Process Receipt</span>
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
                                    Retake Photo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Receipt Data Display */}
                {receiptData && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="text-green-500" size={24} />
                                <h2 className="text-xl font-semibold text-green-700">Receipt Processed Successfully</h2>
                            </div>
                            <button
                                onClick={resetScanner}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Store Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Store Information</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Store:</span> {receiptData.store}</p>
                                    <p><span className="font-medium">Address:</span> {receiptData.address}</p>
                                    <p><span className="font-medium">Date:</span> {receiptData.date}</p>
                                    <p><span className="font-medium">Time:</span> {receiptData.time}</p>
                                    <p><span className="font-medium">Receipt #:</span> {receiptData.receiptNumber}</p>
                                    <p><span className="font-medium">Cashier:</span> {receiptData.cashier}</p>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Payment Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>${receiptData.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                    <p className="mt-2"><span className="font-medium">Payment Method:</span> {receiptData.paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Items Purchased</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left p-3">Item</th>
                                            <th className="text-center p-3">Qty</th>
                                            <th className="text-right p-3">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {receiptData.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-3">{item.name}</td>
                                                <td className="p-3 text-center">{item.quantity}</td>
                                                <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={resetScanner}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Scan Another Receipt
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden canvas for image processing */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default HomePage;