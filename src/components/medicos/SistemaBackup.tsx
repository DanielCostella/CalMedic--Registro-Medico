import React, { useState, useEffect } from 'react';
import { Cloud, Database, Download, Upload, RefreshCw, Shield, Clock, CheckCircle, AlertTriangle, Settings, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

interface BackupEntry {
  id: string;
  fecha: string;
  hora: string;
  tipo: 'Automático' | 'Manual' | 'Programado';
  estado: 'Completado' | 'En progreso' | 'Fallido' | 'Cancelado';
  tamaño: number; // en bytes
  duracion: number; // en segundos
  ubicacion: 'Local' | 'Nube' | 'Ambos';
  descripcion: string;
  tablas: string[];
  registros: number;
}

interface ConfiguracionBackup {
  automatico: boolean;
  frecuencia: 'Diario' | 'Semanal' | 'Mensual';
  hora: string;
  retencion: number; // días
  compresion: boolean;
  encriptacion: boolean;
  ubicacionPrimaria: 'Local' | 'Nube';
  ubicacionSecundaria: 'Local' | 'Nube' | 'Ninguna';
  notificaciones: boolean;
}

interface EstadoSistema {
  conectado: boolean;
  ultimoBackup: string;
  proximoBackup: string;
  espacioLocal: {
    usado: number;
    total: number;
  };
  espacioNube: {
    usado: number;
    total: number;
  };
  sincronizacion: {
    estado: 'Sincronizado' | 'Sincronizando' | 'Error' | 'Desconectado';
    ultimaSincronizacion: string;
    pendientes: number;
  };
}

const SistemaBackupComponent: React.FC = () => {
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupEnProgreso, setBackupEnProgreso] = useState(false);
  const [progresoBackup, setProgresoBackup] = useState(0);
  const [showConfiguracion, setShowConfiguracion] = useState(false);
  const [showRestaurar, setShowRestaurar] = useState(false);
  const [backupSeleccionado, setBackupSeleccionado] = useState<BackupEntry | null>(null);

  const [configuracion, setConfiguracion] = useState<ConfiguracionBackup>({
    automatico: true,
    frecuencia: 'Diario',
    hora: '02:00',
    retencion: 30,
    compresion: true,
    encriptacion: true,
    ubicacionPrimaria: 'Nube',
    ubicacionSecundaria: 'Local',
    notificaciones: true
  });

  const [estadoSistema, setEstadoSistema] = useState<EstadoSistema>({
    conectado: true,
    ultimoBackup: '2024-01-16 02:00:00',
    proximoBackup: '2024-01-17 02:00:00',
    espacioLocal: {
      usado: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
      total: 100 * 1024 * 1024 * 1024 // 100 GB
    },
    espacioNube: {
      usado: 1.8 * 1024 * 1024 * 1024, // 1.8 GB
      total: 50 * 1024 * 1024 * 1024 // 50 GB
    },
    sincronizacion: {
      estado: 'Sincronizado',
      ultimaSincronizacion: '2024-01-16 14:30:00',
      pendientes: 0
    }
  });

  useEffect(() => {
    // Simular carga de historial de backups
    setTimeout(() => {
      const backupsIniciales: BackupEntry[] = [
        {
          id: '1',
          fecha: '2024-01-16',
          hora: '02:00:00',
          tipo: 'Automático',
          estado: 'Completado',
          tamaño: 256 * 1024 * 1024, // 256 MB
          duracion: 180, // 3 minutos
          ubicacion: 'Ambos',
          descripcion: 'Backup automático diario',
          tablas: ['pacientes', 'citas', 'historiales', 'recetas', 'archivos'],
          registros: 15420
        },
        {
          id: '2',
          fecha: '2024-01-15',
          hora: '02:00:00',
          tipo: 'Automático',
          estado: 'Completado',
          tamaño: 248 * 1024 * 1024, // 248 MB
          duracion: 175,
          ubicacion: 'Ambos',
          descripcion: 'Backup automático diario',
          tablas: ['pacientes', 'citas', 'historiales', 'recetas', 'archivos'],
          registros: 15380
        },
        {
          id: '3',
          fecha: '2024-01-14',
          hora: '15:30:00',
          tipo: 'Manual',
          estado: 'Completado',
          tamaño: 245 * 1024 * 1024, // 245 MB
          duracion: 95,
          ubicacion: 'Nube',
          descripcion: 'Backup manual antes de actualización',
          tablas: ['pacientes', 'citas', 'historiales', 'recetas'],
          registros: 15350
        },
        {
          id: '4',
          fecha: '2024-01-14',
          hora: '02:00:00',
          tipo: 'Automático',
          estado: 'Completado',
          tamaño: 243 * 1024 * 1024, // 243 MB
          duracion: 170,
          ubicacion: 'Ambos',
          descripcion: 'Backup automático diario',
          tablas: ['pacientes', 'citas', 'historiales', 'recetas', 'archivos'],
          registros: 15320
        },
        {
          id: '5',
          fecha: '2024-01-13',
          hora: '02:00:00',
          tipo: 'Automático',
          estado: 'Fallido',
          tamaño: 0,
          duracion: 0,
          ubicacion: 'Nube',
          descripcion: 'Error de conexión durante backup',
          tablas: [],
          registros: 0
        }
      ];

      setBackups(backupsIniciales);
      setLoading(false);
    }, 1000);

    // Simular actualizaciones de estado del sistema
    const interval = setInterval(() => {
      setEstadoSistema(prev => ({
        ...prev,
        sincronizacion: {
          ...prev.sincronizacion,
          ultimaSincronizacion: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      }));
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calcularPorcentajeUso = (usado: number, total: number): number => {
    return Math.round((usado / total) * 100);
  };

  const iniciarBackupManual = async () => {
    setBackupEnProgreso(true);
    setProgresoBackup(0);

    // Simular progreso de backup
    for (let i = 0; i <= 100; i += 5) {
      setProgresoBackup(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Crear nuevo backup
    const nuevoBackup: BackupEntry = {
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0],
      tipo: 'Manual',
      estado: 'Completado',
      tamaño: Math.floor(Math.random() * 50 + 200) * 1024 * 1024, // 200-250 MB
      duracion: Math.floor(Math.random() * 60 + 90), // 90-150 segundos
      ubicacion: configuracion.ubicacionPrimaria === 'Nube' ? 'Nube' : 'Local',
      descripcion: 'Backup manual iniciado por usuario',
      tablas: ['pacientes', 'citas', 'historiales', 'recetas', 'archivos'],
      registros: Math.floor(Math.random() * 100 + 15400)
    };

    setBackups(prev => [nuevoBackup, ...prev]);
    setBackupEnProgreso(false);
    setProgresoBackup(0);

    // Actualizar estado del sistema
    setEstadoSistema(prev => ({
      ...prev,
      ultimoBackup: `${nuevoBackup.fecha} ${nuevoBackup.hora}`,
      proximoBackup: calcularProximoBackup()
    }));
  };

  const calcularProximoBackup = (): string => {
    const ahora = new Date();
    const proximoBackup = new Date(ahora);
    
    switch (configuracion.frecuencia) {
      case 'Diario':
        proximoBackup.setDate(ahora.getDate() + 1);
        break;
      case 'Semanal':
        proximoBackup.setDate(ahora.getDate() + 7);
        break;
      case 'Mensual':
        proximoBackup.setMonth(ahora.getMonth() + 1);
        break;
    }
    
    const [hora, minuto] = configuracion.hora.split(':');
    proximoBackup.setHours(parseInt(hora), parseInt(minuto), 0, 0);
    
    return proximoBackup.toISOString().replace('T', ' ').substring(0, 19);
  };

  const restaurarBackup = async (backup: BackupEntry) => {
    if (!confirm(`¿Está seguro de que desea restaurar el backup del ${new Date(backup.fecha).toLocaleDateString('es-ES')} a las ${backup.hora}? Esta acción sobrescribirá los datos actuales.`)) {
      return;
    }

    setLoading(true);
    
    // Simular proceso de restauración
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setLoading(false);
    setShowRestaurar(false);
    alert('Backup restaurado exitosamente');
  };

  const eliminarBackup = (backupId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este backup?')) {
      setBackups(prev => prev.filter(b => b.id !== backupId));
    }
  };

  const guardarConfiguracion = () => {
    // Simular guardado de configuración
    setEstadoSistema(prev => ({
      ...prev,
      proximoBackup: calcularProximoBackup()
    }));
    
    setShowConfiguracion(false);
    alert('Configuración guardada exitosamente');
  };

  const obtenerColorEstado = (estado: BackupEntry['estado']) => {
    switch (estado) {
      case 'Completado': return 'text-green-600 bg-green-50 border-green-200';
      case 'En progreso': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Fallido': return 'text-red-600 bg-red-50 border-red-200';
      case 'Cancelado': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading && backups.length === 0) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando sistema de backup..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="w-8 h-8 text-blue-600" />
            Sistema de Backup y Persistencia
          </h1>
          <p className="text-gray-600">
            Gestión automática de copias de seguridad y sincronización de datos
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showConfiguracion} onOpenChange={setShowConfiguracion}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configuración de Backup</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="automatico" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="automatico">Automático</TabsTrigger>
                  <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                  <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
                </TabsList>
                
                <TabsContent value="automatico" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="backup-automatico">Backup Automático</Label>
                      <p className="text-sm text-gray-600">Realizar backups automáticamente</p>
                    </div>
                    <Switch
                      id="backup-automatico"
                      checked={configuracion.automatico}
                      onCheckedChange={(checked) => setConfiguracion({...configuracion, automatico: checked})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frecuencia">Frecuencia</Label>
                      <Select 
                        value={configuracion.frecuencia} 
                        onValueChange={(value: ConfiguracionBackup['frecuencia']) => 
                          setConfiguracion({...configuracion, frecuencia: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diario">Diario</SelectItem>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Mensual">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="hora">Hora</Label>
                      <Input
                        id="hora"
                        type="time"
                        value={configuracion.hora}
                        onChange={(e) => setConfiguracion({...configuracion, hora: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="retencion">Retención (días)</Label>
                    <Input
                      id="retencion"
                      type="number"
                      value={configuracion.retencion}
                      onChange={(e) => setConfiguracion({...configuracion, retencion: parseInt(e.target.value)})}
                      min="1"
                      max="365"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notificaciones">Notificaciones</Label>
                      <p className="text-sm text-gray-600">Recibir notificaciones de backup</p>
                    </div>
                    <Switch
                      id="notificaciones"
                      checked={configuracion.notificaciones}
                      onCheckedChange={(checked) => setConfiguracion({...configuracion, notificaciones: checked})}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="ubicacion" className="space-y-4">
                  <div>
                    <Label htmlFor="ubicacion-primaria">Ubicación Primaria</Label>
                    <Select 
                      value={configuracion.ubicacionPrimaria} 
                      onValueChange={(value: 'Local' | 'Nube') => 
                        setConfiguracion({...configuracion, ubicacionPrimaria: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Local">Almacenamiento Local</SelectItem>
                        <SelectItem value="Nube">Almacenamiento en la Nube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ubicacion-secundaria">Ubicación Secundaria (Opcional)</Label>
                    <Select 
                      value={configuracion.ubicacionSecundaria} 
                      onValueChange={(value: 'Local' | 'Nube' | 'Ninguna') => 
                        setConfiguracion({...configuracion, ubicacionSecundaria: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ninguna">Ninguna</SelectItem>
                        <SelectItem value="Local">Almacenamiento Local</SelectItem>
                        <SelectItem value="Nube">Almacenamiento en la Nube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="seguridad" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compresion">Compresión</Label>
                      <p className="text-sm text-gray-600">Comprimir backups para ahorrar espacio</p>
                    </div>
                    <Switch
                      id="compresion"
                      checked={configuracion.compresion}
                      onCheckedChange={(checked) => setConfiguracion({...configuracion, compresion: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="encriptacion">Encriptación</Label>
                      <p className="text-sm text-gray-600">Encriptar backups para mayor seguridad</p>
                    </div>
                    <Switch
                      id="encriptacion"
                      checked={configuracion.encriptacion}
                      onCheckedChange={(checked) => setConfiguracion({...configuracion, encriptacion: checked})}
                    />
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Seguridad de Datos</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Los backups encriptados utilizan AES-256 para proteger la información médica sensible.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowConfiguracion(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarConfiguracion}>
                  Guardar Configuración
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            onClick={iniciarBackupManual}
            disabled={backupEnProgreso}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {backupEnProgreso ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creando Backup...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Backup Manual
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress bar para backup en progreso */}
      {backupEnProgreso && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Upload className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Creando backup...</span>
                  <span>{progresoBackup}%</span>
                </div>
                <Progress value={progresoBackup} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Estado de Backups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Último backup:</span>
              <span className="font-medium">
                {new Date(estadoSistema.ultimoBackup).toLocaleString('es-ES')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Próximo backup:</span>
              <span className="font-medium">
                {new Date(estadoSistema.proximoBackup).toLocaleString('es-ES')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estado de conexión:</span>
              <div className="flex items-center gap-2">
                {estadoSistema.conectado ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Conectado</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 font-medium">Desconectado</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-green-600" />
              Almacenamiento Local
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Usado:</span>
              <span className="font-medium">{formatFileSize(estadoSistema.espacioLocal.usado)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="font-medium">{formatFileSize(estadoSistema.espacioLocal.total)}</span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Uso del disco</span>
                <span>{calcularPorcentajeUso(estadoSistema.espacioLocal.usado, estadoSistema.espacioLocal.total)}%</span>
              </div>
              <Progress 
                value={calcularPorcentajeUso(estadoSistema.espacioLocal.usado, estadoSistema.espacioLocal.total)} 
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-purple-600" />
              Almacenamiento en la Nube
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Usado:</span>
              <span className="font-medium">{formatFileSize(estadoSistema.espacioNube.usado)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="font-medium">{formatFileSize(estadoSistema.espacioNube.total)}</span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Uso del espacio</span>
                <span>{calcularPorcentajeUso(estadoSistema.espacioNube.usado, estadoSistema.espacioNube.total)}%</span>
              </div>
              <Progress 
                value={calcularPorcentajeUso(estadoSistema.espacioNube.usado, estadoSistema.espacioNube.total)} 
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Backups</p>
                <p className="text-2xl font-bold">{backups.length}</p>
              </div>
              <Database className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Exitosos</p>
                <p className="text-2xl font-bold">
                  {backups.filter(b => b.estado === 'Completado').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Fallidos</p>
                <p className="text-2xl font-bold">
                  {backups.filter(b => b.estado === 'Fallido').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Tamaño Total</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(backups.reduce((total, backup) => total + backup.tamaño, 0))}
                </p>
              </div>
              <HardDrive className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Backups */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay backups registrados</p>
              </div>
            ) : (
              backups.map(backup => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={backup.estado === 'Completado' ? 'default' : backup.estado === 'Fallido' ? 'destructive' : 'secondary'}>
                        {backup.estado}
                      </Badge>
                      <Badge variant="outline">{backup.tipo}</Badge>
                      <Badge variant="outline">{backup.ubicacion}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Fecha:</strong> {new Date(backup.fecha).toLocaleDateString('es-ES')} {backup.hora}
                      </div>
                      <div>
                        <strong>Tamaño:</strong> {formatFileSize(backup.tamaño)}
                      </div>
                      <div>
                        <strong>Duración:</strong> {formatDuration(backup.duracion)}
                      </div>
                      <div>
                        <strong>Registros:</strong> {backup.registros.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mt-1">
                      <strong>Descripción:</strong> {backup.descripcion}
                    </div>
                    
                    {backup.tablas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {backup.tablas.map(tabla => (
                          <Badge key={tabla} variant="secondary" className="text-xs">
                            {tabla}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {backup.estado === 'Completado' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restaurarBackup(backup)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => eliminarBackup(backup.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SistemaBackupComponent;