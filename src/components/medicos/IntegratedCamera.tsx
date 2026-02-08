import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, RotateCcw, Download, FileImage, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface CapturedDocument {
    id: string;
    name: string;
    type: 'id' | 'prescription' | 'exam' | 'xray' | 'document' | 'photo';
    image: string;
    date: Date;
    patient?: string;
    notes?: string;
    processed: boolean;
    extractedText?: string;
}

interface IntegratedCameraProps {
    onDocumentCaptured?: (document: CapturedDocument) => void;
    documentType?: 'id' | 'prescription' | 'exam' | 'xray' | 'document' | 'photo';
}

const IntegratedCamera: React.FC<IntegratedCameraProps> = ({
    onDocumentCaptured,
    documentType = 'document'
}) => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [documents, setDocuments] = useState<CapturedDocument[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [configuration, setConfiguration] = useState({
        resolution: 'hd',
        frontCamera: false,
        autofocus: true,
        flash: false
    });
    const [metadata, setMetadata] = useState({
        name: '',
        type: documentType,
        patient: '',
        notes: ''
    });

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startCamera = async () => {
        try {
            const constraints: MediaStreamConstraints = {
                video: {
                    width: configuration.resolution === 'hd' ? 1280 : 640,
                    height: configuration.resolution === 'hd' ? 720 : 480,
                    facingMode: configuration.frontCamera ? 'user' : 'environment'
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsCameraActive(true);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access the camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(imageDataUrl);
                stopCamera();
            }
        }
    };

    const processImage = async (imageDataUrl: string) => {
        setIsProcessing(true);

        // Simulate OCR processing/image analysis
        await new Promise(resolve => setTimeout(resolve, 2000));

        let extractedText = '';

        // Simulate text extraction based on document type
        switch (metadata.type) {
            case 'id':
                extractedText = 'REPUBLIC OF COLOMBIA\nCITIZEN ID\nName: JUAN CARLOS PEREZ\nID: 12.345.678\nBirth Date: 03/15/1985';
                break;
            case 'prescription':
                extractedText = 'MEDICAL PRESCRIPTION\nDr. Ana Martinez\nPatient: Maria Gonzalez\nMedication: Atorvastatin 20mg\nDosage: 1 tablet daily\nDate: ' + new Date().toLocaleDateString();
                break;
            case 'exam':
                extractedText = 'LABORATORY RESULT\nPatient: Carlos Rodriguez\nExam: Complete Blood Count\nHemoglobin: 14.2 g/dL\nHematocrit: 42.1%\nDate: ' + new Date().toLocaleDateString();
                break;
            default:
                extractedText = 'Document processed successfully. Text extracted via OCR.';
        }

        const newDocument: CapturedDocument = {
            id: Date.now().toString(),
            name: metadata.name || `Document_${Date.now()}`,
            type: metadata.type,
            image: imageDataUrl,
            date: new Date(),
            patient: metadata.patient || undefined,
            notes: metadata.notes || undefined,
            processed: true,
            extractedText
        };

        setDocuments(prev => [newDocument, ...prev]);

        if (onDocumentCaptured) {
            onDocumentCaptured(newDocument);
        }

        setIsProcessing(false);
        setCapturedImage(null);
        setMetadata({
            name: '',
            type: documentType,
            patient: '',
            notes: ''
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target?.result as string;
                setCapturedImage(imageDataUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadImage = (doc: CapturedDocument) => {
        const link = document.createElement('a');
        link.href = doc.image;
        link.download = `${doc.name}.jpg`;
        link.click();
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'id':
                return <FileImage className="w-4 h-4 text-blue-600" />;
            case 'prescription':
                return <FileImage className="w-4 h-4 text-green-600" />;
            case 'exam':
                return <FileImage className="w-4 h-4 text-purple-600" />;
            case 'xray':
                return <Scan className="w-4 h-4 text-orange-600" />;
            case 'photo':
                return <Camera className="w-4 h-4 text-pink-600" />;
            default:
                return <FileImage className="w-4 h-4 text-gray-600" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'id':
                return 'bg-blue-100 text-blue-800';
            case 'prescription':
                return 'bg-green-100 text-green-800';
            case 'exam':
                return 'bg-purple-100 text-purple-800';
            case 'xray':
                return 'bg-orange-100 text-orange-800';
            case 'photo':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Camera className="w-6 h-6 text-blue-600" />
                    <div>
                        <h2 className="text-2xl font-bold">Integrated Camera</h2>
                        <p className="text-gray-600">Capture and process medical documents</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                    </Button>

                    <Button
                        onClick={isCameraActive ? stopCamera : startCamera}
                        className={isCameraActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        {isCameraActive ? 'Stop Camera' : 'Start Camera'}
                    </Button>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Camera Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Capture Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label>Resolution</Label>
                            <Select
                                value={configuration.resolution}
                                onValueChange={(value) =>
                                    setConfiguration(prev => ({ ...prev, resolution: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hd">HD (1280x720)</SelectItem>
                                    <SelectItem value="sd">SD (640x480)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="frontal"
                                checked={configuration.frontCamera}
                                onChange={(e) =>
                                    setConfiguration(prev => ({ ...prev, frontCamera: e.target.checked }))
                                }
                            />
                            <Label htmlFor="frontal">Front camera</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="autofocus"
                                checked={configuration.autofocus}
                                onChange={(e) =>
                                    setConfiguration(prev => ({ ...prev, autofocus: e.target.checked }))
                                }
                            />
                            <Label htmlFor="autofocus">Autofocus</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="flash"
                                checked={configuration.flash}
                                onChange={(e) =>
                                    setConfiguration(prev => ({ ...prev, flash: e.target.checked }))
                                }
                            />
                            <Label htmlFor="flash">Flash</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Camera view or captured image */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                        {isCameraActive && (
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    className="max-w-full h-auto border rounded-lg shadow-lg"
                                    autoPlay
                                    playsInline
                                />
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                    <Button
                                        onClick={captureImage}
                                        size="lg"
                                        className="rounded-full w-16 h-16 bg-white hover:bg-gray-100 text-blue-600 border-4 border-blue-600"
                                    >
                                        <Camera className="w-8 h-8" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {capturedImage && (
                            <div className="space-y-4 w-full max-w-2xl">
                                <div className="relative">
                                    <img
                                        src={capturedImage}
                                        alt="Captured content"
                                        className="w-full h-auto border rounded-lg shadow-lg"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                                        onClick={() => setCapturedImage(null)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Document metadata */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Document name</Label>
                                        <Input
                                            value={metadata.name}
                                            onChange={(e) =>
                                                setMetadata(prev => ({ ...prev, name: e.target.value }))
                                            }
                                            placeholder="e.g.: Patient_ID_John_Doe"
                                        />
                                    </div>

                                    <div>
                                        <Label>Document type</Label>
                                        <Select
                                            value={metadata.type}
                                            onValueChange={(value: 'id' | 'prescription' | 'exam' | 'xray' | 'document' | 'photo') =>
                                                setMetadata(prev => ({ ...prev, type: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="id">ID Card</SelectItem>
                                                <SelectItem value="prescription">Medical Prescription</SelectItem>
                                                <SelectItem value="exam">Laboratory Exam</SelectItem>
                                                <SelectItem value="xray">X-Ray</SelectItem>
                                                <SelectItem value="document">General Document</SelectItem>
                                                <SelectItem value="photo">Photograph</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Patient (optional)</Label>
                                        <Input
                                            value={metadata.patient}
                                            onChange={(e) =>
                                                setMetadata(prev => ({ ...prev, patient: e.target.value }))
                                            }
                                            placeholder="Patient name"
                                        />
                                    </div>

                                    <div>
                                        <Label>Notes (optional)</Label>
                                        <Textarea
                                            value={metadata.notes}
                                            onChange={(e) =>
                                                setMetadata(prev => ({ ...prev, notes: e.target.value }))
                                            }
                                            placeholder="Additional notes"
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCapturedImage(null)}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Capture Another
                                    </Button>

                                    <Button
                                        onClick={() => processImage(capturedImage)}
                                        disabled={isProcessing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Scan className="w-4 h-4 mr-2" />
                                                Process and Save
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                </CardContent>
            </Card>

            {/* Captured documents list */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Captured Documents
                        <Badge variant="outline">{documents.length} documents</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {documents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FileImage className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No documents captured</p>
                            <p className="text-sm mt-2">Use the camera or upload files to start</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {documents.map((document) => (
                                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <img
                                                    src={document.image}
                                                    alt={document.name}
                                                    className="w-full h-32 object-cover rounded border"
                                                />
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <Badge className={getTypeColor(document.type)}>
                                                        {getTypeIcon(document.type)}
                                                    </Badge>
                                                    {document.processed && (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            <CheckCircle className="w-3 h-3" />
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium truncate">{document.name}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {document.date.toLocaleString()}
                                                </p>
                                                {document.patient && (
                                                    <p className="text-xs text-blue-600">
                                                        Patient: {document.patient}
                                                    </p>
                                                )}
                                            </div>

                                            {document.extractedText && (
                                                <div className="p-2 bg-gray-50 rounded text-xs">
                                                    <p className="font-medium mb-1">Extracted text:</p>
                                                    <p className="line-clamp-3">{document.extractedText}</p>
                                                </div>
                                            )}

                                            {document.notes && (
                                                <div className="p-2 bg-blue-50 rounded text-xs">
                                                    <p className="font-medium mb-1">Notes:</p>
                                                    <p>{document.notes}</p>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => downloadImage(document)}
                                                    className="flex-1"
                                                >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    Download
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => deleteDocument(document.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default IntegratedCamera;
