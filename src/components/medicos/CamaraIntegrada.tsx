import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, RotateCcw, Download, FileImage, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface DocumentoCapturado {
  id: string;
  nombre: string;
  tipo: 'cedula' | 'receta' | 'examen' | 'radiografia' | 'documento' | 'foto';
  imagen: string;
  fecha: Date;
  paciente?: string;
  notas?: string;
  procesado: boolean;
  textoExtraido?: string;
}

interface CamaraIntegradaProps {
  onDocumentoCapturado?: (documento: DocumentoCapturado) => void;
  tipoDocumento?: 'cedula' | 'receta' | 'examen' | 'radiografia' | 'documento' | 'foto';
}

const CamaraIntegradaComponent: React.FC<CamaraIntegradaProps> = ({
  onDocumentoCapturado,
  tipoDocumento = 'documento'
}) => {
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [imagenCapturada, setImagenCapturada] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoCapturado[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    resolucion: 'hd',
    camaraFrontal: false,
    autoenfoque: true,
    flash: false
  });
  const [metadatos, setMetadatos] = useState({
    nombre: '',
    tipo: tipoDocumento,
    paciente: '',
    notas: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const iniciarCamara = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: configuracion.resolucion === 'hd' ? 1280 : 640,
          height: configuracion.resolucion === 'hd' ? 720 : 480,
          facingMode: configuracion.camaraFrontal ? 'user' : 'environment',
          focusMode: configuracion.autoenfoque ? 'continuous' : 'manual'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCamaraActiva(true);
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCamaraActiva(false);
  };

  const capturarImagen = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imagenDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImagenCapturada(imagenDataUrl);
        detenerCamara();
      }
    }
  };

  const procesarImagen = async (imagenDataUrl: string) => {
    setProcesando(true);
    
    // Simular procesamiento OCR/análisis de imagen
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let textoExtraido = '';
    
    // Simular extracción de texto según el tipo de documento
    switch (metadatos.tipo) {
      case 'cedula':
        textoExtraido = 'REPÚBLICA DE COLOMBIA\nCÉDULA DE CIUDADANÍA\nNombre: JUAN CARLOS PÉREZ\nCC: 12.345.678\nFecha Nacimiento: 15/03/1985';
        break;
      case 'receta':
        textoExtraido = 'RECETA MÉDICA\nDr. Ana Martínez\nPaciente: María González\nMedicamento: Atorvastatina 20mg\nDosis: 1 tableta diaria\nFecha: ' + new Date().toLocaleDateString();
        break;
      case 'examen':
        textoExtraido = 'RESULTADO DE LABORATORIO\nPaciente: Carlos Rodríguez\nExamen: Hemograma Completo\nHemoglobina: 14.2 g/dL\nHematocrito: 42.1%\nFecha: ' + new Date().toLocaleDateString();
        break;
      default:
        textoExtraido = 'Documento procesado correctamente. Texto extraído mediante OCR.';
    }

    const nuevoDocumento: DocumentoCapturado = {
      id: Date.now().toString(),
      nombre: metadatos.nombre || `Documento_${Date.now()}`,
      tipo: metadatos.tipo,
      imagen: imagenDataUrl,
      fecha: new Date(),
      paciente: metadatos.paciente || undefined,
      notas: metadatos.notas || undefined,
      procesado: true,
      textoExtraido
    };

    setDocumentos(prev => [nuevoDocumento, ...prev]);
    
    if (onDocumentoCapturado) {
      onDocumentoCapturado(nuevoDocumento);
    }

    setProcesando(false);
    setImagenCapturada(null);
    setMetadatos({
      nombre: '',
      tipo: tipoDocumento,
      paciente: '',
      notas: ''
    });
  };

  const manejarArchivoSubido = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imagenDataUrl = e.target?.result as string;
        setImagenCapturada(imagenDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const descargarImagen = (documento: DocumentoCapturado) => {
    const link = document.createElement('a');
    link.href = documento.imagen;
    link.download = `${documento.nombre}.jpg`;
    link.click();
  };

  const eliminarDocumento = (id: string) => {
    setDocumentos(prev => prev.filter(doc => doc.id !== id));
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'cedula':
        return <FileImage className="w-4 h-4 text-blue-600" />;
      case 'receta':
        return <FileImage className="w-4 h-4 text-green-600" />;
      case 'examen':
        return <FileImage className="w-4 h-4 text-purple-600" />;
      case 'radiografia':
        return <Scan className="w-4 h-4 text-orange-600" />;
      case 'foto':
        return <Camera className="w-4 h-4 text-pink-600" />;
      default:
        return <FileImage className="w-4 h-4 text-gray-600" />;
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'cedula':
        return 'bg-blue-100 text-blue-800';
      case 'receta':
        return 'bg-green-100 text-green-800';
      case 'examen':
        return 'bg-purple-100 text-purple-800';
      case 'radiografia':
        return 'bg-orange-100 text-orange-800';
      case 'foto':
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
            <h2 className="text-2xl font-bold">Cámara Integrada</h2>
            <p className="text-gray-600">Captura y procesa documentos médicos</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Subir Archivo
          </Button>
          
          <Button
            onClick={camaraActiva ? detenerCamara : iniciarCamara}
            className={camaraActiva ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
          >
            <Camera className="w-4 h-4 mr-2" />
            {camaraActiva ? 'Detener Cámara' : 'Iniciar Cámara'}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={manejarArchivoSubido}
        className="hidden"
      />

      {/* Configuración de cámara */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuración de Captura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Resolución</Label>
              <Select
                value={configuracion.resolucion}
                onValueChange={(value) =>
                  setConfiguracion(prev => ({ ...prev, resolucion: value }))
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
                checked={configuracion.camaraFrontal}
                onChange={(e) =>
                  setConfiguracion(prev => ({ ...prev, camaraFrontal: e.target.checked }))
                }
              />
              <Label htmlFor="frontal">Cámara frontal</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoenfoque"
                checked={configuracion.autoenfoque}
                onChange={(e) =>
                  setConfiguracion(prev => ({ ...prev, autoenfoque: e.target.checked }))
                }
              />
              <Label htmlFor="autoenfoque">Autoenfoque</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="flash"
                checked={configuracion.flash}
                onChange={(e) =>
                  setConfiguracion(prev => ({ ...prev, flash: e.target.checked }))
                }
              />
              <Label htmlFor="flash">Flash</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vista de cámara o imagen capturada */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {camaraActiva && (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="max-w-full h-auto border rounded-lg shadow-lg"
                  autoPlay
                  playsInline
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Button
                    onClick={capturarImagen}
                    size="lg"
                    className="rounded-full w-16 h-16 bg-white hover:bg-gray-100 text-blue-600 border-4 border-blue-600"
                  >
                    <Camera className="w-8 h-8" />
                  </Button>
                </div>
              </div>
            )}

            {imagenCapturada && (
              <div className="space-y-4 w-full max-w-2xl">
                <div className="relative">
                  <img
                    src={imagenCapturada}
                    alt="Imagen capturada"
                    className="w-full h-auto border rounded-lg shadow-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                    onClick={() => setImagenCapturada(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Metadatos del documento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre del documento</Label>
                    <Input
                      value={metadatos.nombre}
                      onChange={(e) =>
                        setMetadatos(prev => ({ ...prev, nombre: e.target.value }))
                      }
                      placeholder="Ej: Cedula_Juan_Perez"
                    />
                  </div>
                  
                  <div>
                    <Label>Tipo de documento</Label>
                    <Select
                      value={metadatos.tipo}
                      onValueChange={(value: 'cedula' | 'receta' | 'examen' | 'radiografia' | 'documento' | 'foto') =>
                        setMetadatos(prev => ({ ...prev, tipo: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cedula">Cédula</SelectItem>
                        <SelectItem value="receta">Receta Médica</SelectItem>
                        <SelectItem value="examen">Examen de Laboratorio</SelectItem>
                        <SelectItem value="radiografia">Radiografía</SelectItem>
                        <SelectItem value="documento">Documento General</SelectItem>
                        <SelectItem value="foto">Fotografía</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Paciente (opcional)</Label>
                    <Input
                      value={metadatos.paciente}
                      onChange={(e) =>
                        setMetadatos(prev => ({ ...prev, paciente: e.target.value }))
                      }
                      placeholder="Nombre del paciente"
                    />
                  </div>
                  
                  <div>
                    <Label>Notas (opcional)</Label>
                    <Textarea
                      value={metadatos.notas}
                      onChange={(e) =>
                        setMetadatos(prev => ({ ...prev, notas: e.target.value }))
                      }
                      placeholder="Notas adicionales"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setImagenCapturada(null)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Capturar Otra
                  </Button>
                  
                  <Button
                    onClick={() => procesarImagen(imagenCapturada)}
                    disabled={procesando}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {procesando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4 mr-2" />
                        Procesar y Guardar
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

      {/* Lista de documentos capturados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Documentos Capturados
            <Badge variant="outline">{documentos.length} documentos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileImage className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay documentos capturados</p>
              <p className="text-sm mt-2">Usa la cámara o sube archivos para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentos.map((documento) => (
                <Card key={documento.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <img
                          src={documento.imagen}
                          alt={documento.nombre}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge className={getColorTipo(documento.tipo)}>
                            {getIconoTipo(documento.tipo)}
                          </Badge>
                          {documento.procesado && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium truncate">{documento.nombre}</h4>
                        <p className="text-xs text-gray-500">
                          {documento.fecha.toLocaleString('es-ES')}
                        </p>
                        {documento.paciente && (
                          <p className="text-xs text-blue-600">
                            Paciente: {documento.paciente}
                          </p>
                        )}
                      </div>
                      
                      {documento.textoExtraido && (
                        <div className="p-2 bg-gray-50 rounded text-xs">
                          <p className="font-medium mb-1">Texto extraído:</p>
                          <p className="line-clamp-3">{documento.textoExtraido}</p>
                        </div>
                      )}
                      
                      {documento.notas && (
                        <div className="p-2 bg-blue-50 rounded text-xs">
                          <p className="font-medium mb-1">Notas:</p>
                          <p>{documento.notas}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => descargarImagen(documento)}
                          className="flex-1"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Descargar
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => eliminarDocumento(documento.id)}
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

export default CamaraIntegradaComponent;