import React, { useState, useEffect } from 'react';
import { Upload, File, Image, FileText, Download, Eye, Trash2, Search, Filter, FolderOpen, Calendar, User, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';

interface ArchivoMedico {
  id: string;
  nombre: string;
  tipo: 'imagen' | 'documento' | 'laboratorio' | 'radiologia' | 'otro';
  extension: string;
  tamaño: number; // en bytes
  fechaSubida: string;
  fechaCreacion?: string;
  pacienteId: string;
  pacienteNombre: string;
  categoria: string;
  descripcion: string;
  tags: string[];
  url: string; // URL del archivo
  thumbnail?: string; // URL de miniatura para imágenes
  metadatos: {
    resolucion?: string;
    duracion?: string;
    paginas?: number;
    autor?: string;
  };
}

interface CarpetaVirtual {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  archivos: string[]; // IDs de archivos
  fechaCreacion: string;
}

const SistemaArchivosComponent: React.FC = () => {
  const [archivos, setArchivos] = useState<ArchivoMedico[]>([]);
  const [carpetas, setCarpetas] = useState<CarpetaVirtual[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showVisor, setShowVisor] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoMedico | null>(null);
  const [showNuevaCarpeta, setShowNuevaCarpeta] = useState(false);
  const [carpetaActiva, setCarpetaActiva] = useState<string>('todos');
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [vistaActual, setVistaActual] = useState<'grid' | 'lista'>('grid');

  const [nuevaCarpeta, setNuevaCarpeta] = useState({
    nombre: '',
    descripcion: '',
    color: '#3B82F6'
  });

  const [nuevoArchivo, setNuevoArchivo] = useState({
    pacienteId: '',
    pacienteNombre: '',
    categoria: '',
    descripcion: '',
    tags: [] as string[],
    nuevoTag: ''
  });

  useEffect(() => {
    // Simular carga de archivos
    setTimeout(() => {
      const archivosIniciales: ArchivoMedico[] = [
        {
          id: '1',
          nombre: 'Radiografía_Tórax_María_González.jpg',
          tipo: 'imagen',
          extension: 'jpg',
          tamaño: 2048000, // 2MB
          fechaSubida: '2024-01-15',
          fechaCreacion: '2024-01-15',
          pacienteId: '1',
          pacienteNombre: 'María González',
          categoria: 'Radiología',
          descripcion: 'Radiografía de tórax PA y lateral',
          tags: ['radiografía', 'tórax', 'control'],
          url: '/api/archivos/1',
          thumbnail: '/api/thumbnails/1',
          metadatos: {
            resolucion: '2048x1536',
            autor: 'Dr. Radiólogo'
          }
        },
        {
          id: '2',
          nombre: 'Laboratorio_Hemograma_Carlos_Rodriguez.pdf',
          tipo: 'documento',
          extension: 'pdf',
          tamaño: 512000, // 512KB
          fechaSubida: '2024-01-14',
          fechaCreacion: '2024-01-14',
          pacienteId: '2',
          pacienteNombre: 'Carlos Rodríguez',
          categoria: 'Laboratorio',
          descripción: 'Hemograma completo con recuento diferencial',
          tags: ['hemograma', 'laboratorio', 'sangre'],
          url: '/api/archivos/2',
          metadatos: {
            paginas: 2,
            autor: 'Lab Central'
          }
        },
        {
          id: '3',
          nombre: 'Ecografía_Abdominal_Ana_Martinez.dcm',
          tipo: 'imagen',
          extension: 'dcm',
          tamaño: 15728640, // 15MB
          fechaSubida: '2024-01-13',
          fechaCreacion: '2024-01-13',
          pacienteId: '3',
          pacienteNombre: 'Ana Martínez',
          categoria: 'Ecografía',
          descripcion: 'Ecografía abdominal completa',
          tags: ['ecografía', 'abdomen', 'diagnóstico'],
          url: '/api/archivos/3',
          thumbnail: '/api/thumbnails/3',
          metadatos: {
            resolucion: '1024x768',
            autor: 'Dr. Ecografista'
          }
        },
        {
          id: '4',
          nombre: 'Historia_Clínica_Luis_Garcia.docx',
          tipo: 'documento',
          extension: 'docx',
          tamaño: 1024000, // 1MB
          fechaSubida: '2024-01-12',
          fechaCreacion: '2024-01-12',
          pacienteId: '4',
          pacienteNombre: 'Luis García',
          categoria: 'Historia Clínica',
          descripcion: 'Historia clínica completa - Primera consulta',
          tags: ['historia', 'primera consulta', 'anamnesis'],
          url: '/api/archivos/4',
          metadatos: {
            paginas: 5,
            autor: 'Dr. Sistema'
          }
        },
        {
          id: '5',
          nombre: 'TAC_Cerebral_Elena_Torres.zip',
          tipo: 'radiologia',
          extension: 'zip',
          tamaño: 52428800, // 50MB
          fechaSubida: '2024-01-11',
          fechaCreacion: '2024-01-11',
          pacienteId: '5',
          pacienteNombre: 'Elena Torres',
          categoria: 'Tomografía',
          descripcion: 'TAC cerebral sin contraste - Serie completa',
          tags: ['tac', 'cerebro', 'neurología'],
          url: '/api/archivos/5',
          metadatos: {
            autor: 'Servicio de Radiología'
          }
        }
      ];

      const carpetasIniciales: CarpetaVirtual[] = [
        {
          id: '1',
          nombre: 'Radiología',
          descripcion: 'Estudios radiológicos y de imagen',
          color: '#3B82F6',
          archivos: ['1', '3', '5'],
          fechaCreacion: '2024-01-01'
        },
        {
          id: '2',
          nombre: 'Laboratorio',
          descripcion: 'Resultados de exámenes de laboratorio',
          color: '#10B981',
          archivos: ['2'],
          fechaCreacion: '2024-01-01'
        },
        {
          id: '3',
          nombre: 'Historias Clínicas',
          descripcion: 'Documentos de historias clínicas',
          color: '#F59E0B',
          archivos: ['4'],
          fechaCreacion: '2024-01-01'
        }
      ];

      setArchivos(archivosIniciales);
      setCarpetas(carpetasIniciales);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simular progreso de subida
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Determinar tipo de archivo
      let tipo: ArchivoMedico['tipo'] = 'otro';
      if (file.type.startsWith('image/')) {
        tipo = 'imagen';
      } else if (file.type === 'application/pdf' || file.type.includes('document')) {
        tipo = 'documento';
      } else if (file.name.toLowerCase().includes('lab')) {
        tipo = 'laboratorio';
      } else if (file.name.toLowerCase().includes('radio') || file.name.toLowerCase().includes('tac') || file.name.toLowerCase().includes('resonancia')) {
        tipo = 'radiologia';
      }

      const nuevoArchivoCompleto: ArchivoMedico = {
        id: Date.now().toString() + i,
        nombre: file.name,
        tipo,
        extension: file.name.split('.').pop() || '',
        tamaño: file.size,
        fechaSubida: new Date().toISOString().split('T')[0],
        pacienteId: nuevoArchivo.pacienteId,
        pacienteNombre: nuevoArchivo.pacienteNombre,
        categoria: nuevoArchivo.categoria,
        descripcion: nuevoArchivo.descripcion,
        tags: nuevoArchivo.tags,
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        metadatos: {
          resolucion: file.type.startsWith('image/') ? 'Calculando...' : undefined,
          autor: 'Usuario'
        }
      };

      setArchivos(prev => [...prev, nuevoArchivoCompleto]);
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (tipo: ArchivoMedico['tipo'], extension: string) => {
    switch (tipo) {
      case 'imagen':
        return <Image className="w-8 h-8 text-blue-600" />;
      case 'documento':
        return <FileText className="w-8 h-8 text-red-600" />;
      case 'laboratorio':
        return <File className="w-8 h-8 text-green-600" />;
      case 'radiologia':
        return <File className="w-8 h-8 text-purple-600" />;
      default:
        return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  const eliminarArchivo = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este archivo?')) {
      setArchivos(prev => prev.filter(a => a.id !== id));
      // También eliminar de carpetas
      setCarpetas(prev => prev.map(carpeta => ({
        ...carpeta,
        archivos: carpeta.archivos.filter(archivoId => archivoId !== id)
      })));
    }
  };

  const crearCarpeta = () => {
    const carpeta: CarpetaVirtual = {
      id: Date.now().toString(),
      nombre: nuevaCarpeta.nombre,
      descripcion: nuevaCarpeta.descripcion,
      color: nuevaCarpeta.color,
      archivos: [],
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    
    setCarpetas(prev => [...prev, carpeta]);
    setShowNuevaCarpeta(false);
    setNuevaCarpeta({ nombre: '', descripcion: '', color: '#3B82F6' });
  };

  const agregarTag = () => {
    if (nuevoArchivo.nuevoTag.trim() && !nuevoArchivo.tags.includes(nuevoArchivo.nuevoTag.trim())) {
      setNuevoArchivo(prev => ({
        ...prev,
        tags: [...prev.tags, prev.nuevoTag.trim()],
        nuevoTag: ''
      }));
    }
  };

  const eliminarTag = (tag: string) => {
    setNuevoArchivo(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const archivosFiltrados = archivos.filter(archivo => {
    const matchBusqueda = !busqueda || 
      archivo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      archivo.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      archivo.pacienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      archivo.tags.some(tag => tag.toLowerCase().includes(busqueda.toLowerCase()));
    
    const matchTipo = !filtroTipo || archivo.tipo === filtroTipo;
    const matchCategoria = !filtroCategoria || archivo.categoria === filtroCategoria;
    const matchFecha = !filtroFecha || archivo.fechaSubida === filtroFecha;
    
    // Filtro por carpeta
    let matchCarpeta = true;
    if (carpetaActiva !== 'todos') {
      const carpeta = carpetas.find(c => c.id === carpetaActiva);
      matchCarpeta = carpeta ? carpeta.archivos.includes(archivo.id) : false;
    }
    
    return matchBusqueda && matchTipo && matchCategoria && matchFecha && matchCarpeta;
  });

  const categorias = [...new Set(archivos.map(a => a.categoria))];

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando sistema de archivos..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-8 h-8 text-blue-600" />
            Sistema de Archivos Médicos
          </h1>
          <p className="text-gray-600">
            Gestión centralizada de documentos e imágenes médicas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showNuevaCarpeta} onOpenChange={setShowNuevaCarpeta}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                Nueva Carpeta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Carpeta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre-carpeta">Nombre de la Carpeta</Label>
                  <Input
                    id="nombre-carpeta"
                    value={nuevaCarpeta.nombre}
                    onChange={(e) => setNuevaCarpeta({...nuevaCarpeta, nombre: e.target.value})}
                    placeholder="ej: Cardiología"
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion-carpeta">Descripción</Label>
                  <Textarea
                    id="descripcion-carpeta"
                    value={nuevaCarpeta.descripcion}
                    onChange={(e) => setNuevaCarpeta({...nuevaCarpeta, descripcion: e.target.value})}
                    placeholder="Descripción de la carpeta..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="color-carpeta">Color</Label>
                  <Input
                    id="color-carpeta"
                    type="color"
                    value={nuevaCarpeta.color}
                    onChange={(e) => setNuevaCarpeta({...nuevaCarpeta, color: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowNuevaCarpeta(false)}>
                  Cancelar
                </Button>
                <Button onClick={crearCarpeta} disabled={!nuevaCarpeta.nombre}>
                  Crear Carpeta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="relative">
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.dcm,.zip"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Subir Archivos
            </Button>
          </div>
        </div>
      </div>

      {/* Progress bar para subida */}
      {uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Upload className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Subiendo archivos...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Archivos</p>
                <p className="text-2xl font-bold">{archivos.length}</p>
              </div>
              <File className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Imágenes</p>
                <p className="text-2xl font-bold">
                  {archivos.filter(a => a.tipo === 'imagen').length}
                </p>
              </div>
              <Image className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Documentos</p>
                <p className="text-2xl font-bold">
                  {archivos.filter(a => a.tipo === 'documento').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Carpetas</p>
                <p className="text-2xl font-bold">{carpetas.length}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carpetas */}
      <Card>
        <CardHeader>
          <CardTitle>Carpetas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Button
              variant={carpetaActiva === 'todos' ? 'default' : 'outline'}
              onClick={() => setCarpetaActiva('todos')}
              className="whitespace-nowrap"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Todos los archivos ({archivos.length})
            </Button>
            {carpetas.map(carpeta => (
              <Button
                key={carpeta.id}
                variant={carpetaActiva === carpeta.id ? 'default' : 'outline'}
                onClick={() => setCarpetaActiva(carpeta.id)}
                className="whitespace-nowrap"
                style={{ 
                  backgroundColor: carpetaActiva === carpeta.id ? carpeta.color : undefined,
                  borderColor: carpeta.color
                }}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                {carpeta.nombre} ({carpeta.archivos.length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar archivos por nombre, descripción, paciente o tags..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="imagen">Imágenes</SelectItem>
                  <SelectItem value="documento">Documentos</SelectItem>
                  <SelectItem value="laboratorio">Laboratorio</SelectItem>
                  <SelectItem value="radiologia">Radiología</SelectItem>
                  <SelectItem value="otro">Otros</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-40"
              />
              
              <div className="flex border rounded-md">
                <Button
                  variant={vistaActual === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setVistaActual('grid')}
                  className="rounded-r-none"
                >
                  Grid
                </Button>
                <Button
                  variant={vistaActual === 'lista' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setVistaActual('lista')}
                  className="rounded-l-none"
                >
                  Lista
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista/Grid de Archivos */}
      <div className={vistaActual === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
        {archivosFiltrados.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-gray-500">
              <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron archivos que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          archivosFiltrados.map(archivo => (
            <Card key={archivo.id} className={`hover:shadow-lg transition-shadow ${vistaActual === 'lista' ? 'w-full' : ''}`}>
              <CardContent className={`p-4 ${vistaActual === 'lista' ? 'flex items-center gap-4' : ''}`}>
                {vistaActual === 'grid' ? (
                  // Vista Grid
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {getFileIcon(archivo.tipo, archivo.extension)}
                      <Badge variant="outline" className="text-xs">
                        {archivo.extension.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {archivo.thumbnail && (
                      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={archivo.thumbnail} 
                          alt={archivo.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium text-sm truncate" title={archivo.nombre}>
                        {archivo.nombre}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {archivo.pacienteNombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(archivo.tamaño)} • {new Date(archivo.fechaSubida).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    
                    {archivo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {archivo.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {archivo.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{archivo.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setArchivoSeleccionado(archivo);
                          setShowVisor(true);
                        }}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Simular descarga
                          const link = document.createElement('a');
                          link.href = archivo.url;
                          link.download = archivo.nombre;
                          link.click();
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => eliminarArchivo(archivo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Vista Lista
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4 flex-1">
                      {getFileIcon(archivo.tipo, archivo.extension)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{archivo.nombre}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{archivo.pacienteNombre}</span>
                          <span>{formatFileSize(archivo.tamaño)}</span>
                          <span>{new Date(archivo.fechaSubida).toLocaleDateString('es-ES')}</span>
                          <Badge variant="outline" className="text-xs">
                            {archivo.categoria}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setArchivoSeleccionado(archivo);
                          setShowVisor(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = archivo.url;
                          link.download = archivo.nombre;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => eliminarArchivo(archivo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Visor de Archivos */}
      <Dialog open={showVisor} onOpenChange={setShowVisor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {archivoSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getFileIcon(archivoSeleccionado.tipo, archivoSeleccionado.extension)}
                  {archivoSeleccionado.nombre}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="vista" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="vista">Vista Previa</TabsTrigger>
                  <TabsTrigger value="detalles">Detalles</TabsTrigger>
                </TabsList>
                
                <TabsContent value="vista" className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50 min-h-96 flex items-center justify-center">
                    {archivoSeleccionado.tipo === 'imagen' && archivoSeleccionado.thumbnail ? (
                      <img 
                        src={archivoSeleccionado.thumbnail} 
                        alt={archivoSeleccionado.nombre}
                        className="max-w-full max-h-96 object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        {getFileIcon(archivoSeleccionado.tipo, archivoSeleccionado.extension)}
                        <p className="mt-4 text-gray-600">
                          Vista previa no disponible para este tipo de archivo
                        </p>
                        <Button className="mt-4" onClick={() => {
                          const link = document.createElement('a');
                          link.href = archivoSeleccionado.url;
                          link.download = archivoSeleccionado.nombre;
                          link.click();
                        }}>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar Archivo
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="detalles" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Información General</h4>
                      <div><strong>Nombre:</strong> {archivoSeleccionado.nombre}</div>
                      <div><strong>Tipo:</strong> {archivoSeleccionado.tipo}</div>
                      <div><strong>Tamaño:</strong> {formatFileSize(archivoSeleccionado.tamaño)}</div>
                      <div><strong>Extensión:</strong> {archivoSeleccionado.extension.toUpperCase()}</div>
                      <div><strong>Fecha de subida:</strong> {new Date(archivoSeleccionado.fechaSubida).toLocaleDateString('es-ES')}</div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Información Médica</h4>
                      <div><strong>Paciente:</strong> {archivoSeleccionado.pacienteNombre}</div>
                      <div><strong>Categoría:</strong> {archivoSeleccionado.categoria}</div>
                      <div><strong>Descripción:</strong> {archivoSeleccionado.descripcion}</div>
                    </div>
                  </div>
                  
                  {archivoSeleccionado.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {archivoSeleccionado.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {Object.keys(archivoSeleccionado.metadatos).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Metadatos</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {archivoSeleccionado.metadatos.resolucion && (
                          <div><strong>Resolución:</strong> {archivoSeleccionado.metadatos.resolucion}</div>
                        )}
                        {archivoSeleccionado.metadatos.paginas && (
                          <div><strong>Páginas:</strong> {archivoSeleccionado.metadatos.paginas}</div>
                        )}
                        {archivoSeleccionado.metadatos.autor && (
                          <div><strong>Autor:</strong> {archivoSeleccionado.metadatos.autor}</div>
                        )}
                        {archivoSeleccionado.metadatos.duracion && (
                          <div><strong>Duración:</strong> {archivoSeleccionado.metadatos.duracion}</div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = archivoSeleccionado.url;
                    link.download = archivoSeleccionado.nombre;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SistemaArchivosComponent;