import React, { useState, useEffect } from 'react';
import { Zap, Wifi, WifiOff, Download, Smartphone, Monitor, Gauge, Settings, CheckCircle, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MetricaRendimiento {
  nombre: string;
  valor: number;
  unidad: string;
  estado: 'Excelente' | 'Bueno' | 'Regular' | 'Malo';
  descripcion: string;
  recomendacion?: string;
}

interface ConfiguracionPWA {
  habilitada: boolean;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string;
  temaColor: string;
  colorFondo: string;
  orientacion: 'portrait' | 'landscape' | 'any';
  pantallaSplash: boolean;
  notificacionesPush: boolean;
  instalacionAutomatica: boolean;
}

interface CacheEstado {
  tamaño: number;
  elementos: number;
  ultimaActualizacion: string;
  estrategia: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  tiposArchivo: {
    html: number;
    css: number;
    js: number;
    imagenes: number;
    datos: number;
  };
}

interface EstadoConexion {
  online: boolean;
  tipoConexion: string;
  velocidad: number; // Mbps
  latencia: number; // ms
  estable: boolean;
}

const OptimizacionesAvanzadasComponent: React.FC = () => {
  const [metricas, setMetricas] = useState<MetricaRendimiento[]>([]);
  const [configuracionPWA, setConfiguracionPWA] = useState<ConfiguracionPWA>({
    habilitada: false,
    nombre: 'Sistema Médico Integral',
    descripcionCorta: 'Sistema médico completo',
    descripcionLarga: 'Sistema integral de gestión médica con funcionalidades completas para consultorios y clínicas',
    temaColor: '#3B82F6',
    colorFondo: '#FFFFFF',
    orientacion: 'portrait',
    pantallaSplash: true,
    notificacionesPush: true,
    instalacionAutomatica: false
  });
  const [cacheEstado, setCacheEstado] = useState<CacheEstado>({
    tamaño: 15.7 * 1024 * 1024, // 15.7 MB
    elementos: 247,
    ultimaActualizacion: '2024-01-16 14:30:00',
    estrategia: 'stale-while-revalidate',
    tiposArchivo: {
      html: 12,
      css: 8,
      js: 45,
      imagenes: 156,
      datos: 26
    }
  });
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>({
    online: true,
    tipoConexion: 'wifi',
    velocidad: 25.6,
    latencia: 45,
    estable: true
  });
  
  const [loading, setLoading] = useState(true);
  const [instalandoPWA, setInstalandoPWA] = useState(false);
  const [optimizando, setOptimizando] = useState(false);
  const [showConfiguracion, setShowConfiguracion] = useState(false);
  const [modoOffline, setModoOffline] = useState(false);

  useEffect(() => {
    // Simular carga de métricas de rendimiento
    setTimeout(() => {
      const metricasIniciales: MetricaRendimiento[] = [
        {
          nombre: 'First Contentful Paint',
          valor: 1.2,
          unidad: 's',
          estado: 'Excelente',
          descripcion: 'Tiempo hasta que aparece el primer contenido',
          recomendacion: 'Mantener por debajo de 1.8s'
        },
        {
          nombre: 'Largest Contentful Paint',
          valor: 2.1,
          unidad: 's',
          estado: 'Bueno',
          descripcion: 'Tiempo hasta que aparece el contenido principal',
          recomendacion: 'Optimizar imágenes grandes'
        },
        {
          nombre: 'Cumulative Layout Shift',
          valor: 0.05,
          unidad: '',
          estado: 'Excelente',
          descripcion: 'Estabilidad visual de la página',
          recomendacion: 'Mantener por debajo de 0.1'
        },
        {
          nombre: 'First Input Delay',
          valor: 45,
          unidad: 'ms',
          estado: 'Excelente',
          descripcion: 'Tiempo de respuesta a la primera interacción',
          recomendacion: 'Mantener por debajo de 100ms'
        },
        {
          nombre: 'Total Blocking Time',
          valor: 150,
          unidad: 'ms',
          estado: 'Bueno',
          descripcion: 'Tiempo total de bloqueo del hilo principal',
          recomendacion: 'Reducir JavaScript no crítico'
        },
        {
          nombre: 'Speed Index',
          valor: 2.8,
          unidad: 's',
          estado: 'Regular',
          descripcion: 'Velocidad de carga visual del contenido',
          recomendacion: 'Implementar lazy loading'
        },
        {
          nombre: 'Bundle Size',
          valor: 1.2,
          unidad: 'MB',
          estado: 'Bueno',
          descripcion: 'Tamaño total del JavaScript',
          recomendacion: 'Considerar code splitting'
        },
        {
          nombre: 'Memory Usage',
          valor: 45,
          unidad: 'MB',
          estado: 'Excelente',
          descripcion: 'Uso de memoria de la aplicación',
          recomendacion: 'Monitorear memory leaks'
        }
      ];

      setMetricas(metricasIniciales);
      setLoading(false);
    }, 1000);

    // Simular monitoreo de conexión
    const intervalConexion = setInterval(() => {
      setEstadoConexion(prev => ({
        ...prev,
        velocidad: Math.random() * 30 + 10, // 10-40 Mbps
        latencia: Math.random() * 50 + 20, // 20-70 ms
        estable: Math.random() > 0.1 // 90% estable
      }));
    }, 5000);

    return () => clearInterval(intervalConexion);
  }, []);

  const instalarPWA = async () => {
    setInstalandoPWA(true);
    
    // Simular instalación de PWA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setConfiguracionPWA(prev => ({ ...prev, habilitada: true }));
    setInstalandoPWA(false);
    
    // Mostrar notificación de instalación exitosa
    if (Notification.permission === 'granted') {
      new Notification('PWA Instalada', {
        body: 'El Sistema Médico Integral ahora está disponible como aplicación',
        icon: '/favicon.png'
      });
    }
  };

  const optimizarRendimiento = async () => {
    setOptimizando(true);
    
    // Simular optimizaciones
    const optimizaciones = [
      'Comprimiendo recursos CSS y JS...',
      'Optimizando imágenes...',
      'Configurando cache estratégico...',
      'Implementando lazy loading...',
      'Minificando código...',
      'Configurando service worker...'
    ];
    
    for (const optimizacion of optimizaciones) {
      console.log(optimizacion);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Actualizar métricas simulando mejoras
    setMetricas(prev => prev.map(metrica => {
      let nuevoValor = metrica.valor;
      let nuevoEstado = metrica.estado;
      
      switch (metrica.nombre) {
        case 'Speed Index':
          nuevoValor = Math.max(1.5, metrica.valor - 0.5);
          nuevoEstado = nuevoValor < 2.0 ? 'Excelente' : 'Bueno';
          break;
        case 'Total Blocking Time':
          nuevoValor = Math.max(50, metrica.valor - 30);
          nuevoEstado = nuevoValor < 100 ? 'Excelente' : 'Bueno';
          break;
        case 'Bundle Size':
          nuevoValor = Math.max(0.8, metrica.valor - 0.2);
          nuevoEstado = nuevoValor < 1.0 ? 'Excelente' : 'Bueno';
          break;
      }
      
      return { ...metrica, valor: nuevoValor, estado: nuevoEstado };
    }));
    
    // Actualizar cache
    setCacheEstado(prev => ({
      ...prev,
      ultimaActualizacion: new Date().toISOString().replace('T', ' ').substring(0, 19),
      elementos: prev.elementos + 15
    }));
    
    setOptimizando(false);
  };

  const limpiarCache = async () => {
    // Simular limpieza de cache
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCacheEstado(prev => ({
      ...prev,
      tamaño: prev.tamaño * 0.3, // Reducir a 30%
      elementos: Math.floor(prev.elementos * 0.3),
      ultimaActualizacion: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }));
  };

  const toggleModoOffline = () => {
    setModoOffline(!modoOffline);
    setEstadoConexion(prev => ({ ...prev, online: !modoOffline }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const obtenerColorMetrica = (estado: MetricaRendimiento['estado']) => {
    switch (estado) {
      case 'Excelente': return 'text-green-600 bg-green-50 border-green-200';
      case 'Bueno': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Regular': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Malo': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const calcularPuntuacionGeneral = (): number => {
    const puntuaciones = metricas.map(metrica => {
      switch (metrica.estado) {
        case 'Excelente': return 100;
        case 'Bueno': return 80;
        case 'Regular': return 60;
        case 'Malo': return 40;
        default: return 50;
      }
    });
    
    return Math.round(puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando optimizaciones avanzadas..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            Optimizaciones Avanzadas
          </h1>
          <p className="text-gray-600">
            PWA, modo offline, optimización de rendimiento y métricas avanzadas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={optimizarRendimiento}
            disabled={optimizando}
            variant="outline"
          >
            {optimizando ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Optimizando...
              </>
            ) : (
              <>
                <Gauge className="w-4 h-4 mr-2" />
                Optimizar
              </>
            )}
          </Button>
          
          <Button
            onClick={instalarPWA}
            disabled={instalandoPWA || configuracionPWA.habilitada}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {instalandoPWA ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Instalando...
              </>
            ) : configuracionPWA.habilitada ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                PWA Instalada
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Instalar PWA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Estado de Conexión */}
      <Card className={`border-2 ${estadoConexion.online ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {estadoConexion.online ? (
                <Wifi className="w-6 h-6 text-green-600" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h3 className="font-semibold">
                  {estadoConexion.online ? 'Conectado' : 'Modo Offline'}
                </h3>
                <p className="text-sm text-gray-600">
                  {estadoConexion.online ? 
                    `${estadoConexion.tipoConexion.toUpperCase()} - ${estadoConexion.velocidad.toFixed(1)} Mbps - ${estadoConexion.latencia}ms` :
                    'Trabajando con datos en caché'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={estadoConexion.estable ? 'default' : 'destructive'}>
                {estadoConexion.estable ? 'Estable' : 'Inestable'}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={toggleModoOffline}
              >
                {modoOffline ? 'Activar Online' : 'Simular Offline'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Puntuación General */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Puntuación de Rendimiento</h3>
              <p className="text-gray-600">Basada en métricas Core Web Vitals</p>
            </div>
            <div className="text-center">
              <div className={`text-6xl font-bold ${
                calcularPuntuacionGeneral() >= 90 ? 'text-green-600' :
                calcularPuntuacionGeneral() >= 70 ? 'text-blue-600' :
                calcularPuntuacionGeneral() >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {calcularPuntuacionGeneral()}
              </div>
              <div className="text-sm text-gray-500">de 100</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={calcularPuntuacionGeneral()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs defaultValue="rendimiento" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rendimiento">Rendimiento</TabsTrigger>
          <TabsTrigger value="pwa">PWA</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="offline">Modo Offline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rendimiento" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricas.map((metrica, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm">{metrica.nombre}</h4>
                    <Badge className={obtenerColorMetrica(metrica.estado)}>
                      {metrica.estado}
                    </Badge>
                  </div>
                  
                  <div className="text-2xl font-bold mb-2">
                    {metrica.valor}{metrica.unidad}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {metrica.descripcion}
                  </p>
                  
                  {metrica.recomendacion && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 {metrica.recomendacion}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Optimización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Implementar Lazy Loading</h4>
                    <p className="text-sm text-yellow-700">
                      Las imágenes y componentes no críticos deberían cargarse bajo demanda para mejorar el Speed Index.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Code Splitting</h4>
                    <p className="text-sm text-blue-700">
                      Dividir el JavaScript en chunks más pequeños puede reducir el Total Blocking Time.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Métricas Excelentes</h4>
                    <p className="text-sm text-green-700">
                      FCP, CLS y FID están en rangos excelentes. Mantener las buenas prácticas actuales.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pwa" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Estado de PWA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>PWA Habilitada</span>
                  <Badge variant={configuracionPWA.habilitada ? 'default' : 'secondary'}>
                    {configuracionPWA.habilitada ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Instalable</span>
                  <Badge variant={configuracionPWA.habilitada ? 'default' : 'outline'}>
                    {configuracionPWA.habilitada ? 'Sí' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Service Worker</span>
                  <Badge variant="default">Registrado</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Manifest</span>
                  <Badge variant="default">Válido</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>HTTPS</span>
                  <Badge variant="default">Seguro</Badge>
                </div>
                
                {configuracionPWA.habilitada && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Funcionalidades PWA Activas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Instalación en dispositivo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Funcionamiento offline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Notificaciones push</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Actualizaciones automáticas</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Configuración PWA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nombre de la Aplicación</Label>
                  <div className="text-sm font-medium">{configuracionPWA.nombre}</div>
                </div>
                
                <div>
                  <Label>Descripción</Label>
                  <div className="text-sm text-gray-600">{configuracionPWA.descripcionLarga}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Color del Tema</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: configuracionPWA.temaColor }}
                      />
                      <span className="text-sm">{configuracionPWA.temaColor}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Orientación</Label>
                    <div className="text-sm font-medium capitalize">{configuracionPWA.orientacion}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Pantalla de Splash</Label>
                    <Badge variant={configuracionPWA.pantallaSplash ? 'default' : 'secondary'}>
                      {configuracionPWA.pantallaSplash ? 'Habilitada' : 'Deshabilitada'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Notificaciones Push</Label>
                    <Badge variant={configuracionPWA.notificacionesPush ? 'default' : 'secondary'}>
                      {configuracionPWA.notificacionesPush ? 'Habilitadas' : 'Deshabilitadas'}
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowConfiguracion(true)}
                  variant="outline" 
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar PWA
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Estado del Cache
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tamaño Total</Label>
                    <div className="text-2xl font-bold">{formatFileSize(cacheEstado.tamaño)}</div>
                  </div>
                  <div>
                    <Label>Elementos</Label>
                    <div className="text-2xl font-bold">{cacheEstado.elementos}</div>
                  </div>
                </div>
                
                <div>
                  <Label>Estrategia</Label>
                  <Badge variant="outline" className="ml-2">
                    {cacheEstado.estrategia}
                  </Badge>
                </div>
                
                <div>
                  <Label>Última Actualización</Label>
                  <div className="text-sm text-gray-600">
                    {new Date(cacheEstado.ultimaActualizacion).toLocaleString('es-ES')}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={limpiarCache}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Limpiar Cache
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-1" />
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(cacheEstado.tiposArchivo).map(([tipo, cantidad]) => (
                    <div key={tipo} className="flex items-center justify-between">
                      <span className="capitalize">{tipo}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(cantidad / Math.max(...Object.values(cacheEstado.tiposArchivo))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{cantidad}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Cache</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="estrategia-cache">Estrategia de Cache</Label>
                  <Select value={cacheEstado.estrategia} onValueChange={() => {}}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cache-first">Cache First</SelectItem>
                      <SelectItem value="network-first">Network First</SelectItem>
                      <SelectItem value="stale-while-revalidate">Stale While Revalidate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Cache Automático</Label>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Preload Crítico</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="offline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WifiOff className="w-5 h-5" />
                Funcionalidad Offline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Modo Offline</h4>
                  <p className="text-sm text-gray-600">
                    Simular funcionamiento sin conexión a internet
                  </p>
                </div>
                <Switch
                  checked={modoOffline}
                  onCheckedChange={toggleModoOffline}
                />
              </div>
              
              {modoOffline && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <WifiOff className="w-5 h-5 text-orange-600" />
                    <h4 className="font-medium text-orange-900">Modo Offline Activo</h4>
                  </div>
                  <p className="text-sm text-orange-700">
                    La aplicación está funcionando con datos en caché. 
                    Algunas funcionalidades pueden estar limitadas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funciones Disponibles Offline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Visualizar pacientes guardados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Consultar historiales médicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Ver citas programadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Acceder a recetas emitidas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Visualizar archivos médicos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Funciones Limitadas Offline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Sincronización con laboratorios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Backup automático</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Notificaciones push</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Telemedicina</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Integraciones externas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Datos Sincronizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">1,234</div>
                  <div className="text-sm text-gray-600">Pacientes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">456</div>
                  <div className="text-sm text-gray-600">Citas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">789</div>
                  <div className="text-sm text-gray-600">Historiales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">2,847</div>
                  <div className="text-sm text-gray-600">Archivos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Configuración PWA */}
      <Dialog open={showConfiguracion} onOpenChange={setShowConfiguracion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configuración PWA</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre-app">Nombre de la Aplicación</Label>
                <input
                  id="nombre-app"
                  value={configuracionPWA.nombre}
                  onChange={(e) => setConfiguracionPWA({...configuracionPWA, nombre: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <Label htmlFor="color-tema">Color del Tema</Label>
                <input
                  id="color-tema"
                  type="color"
                  value={configuracionPWA.temaColor}
                  onChange={(e) => setConfiguracionPWA({...configuracionPWA, temaColor: e.target.value})}
                  className="w-full p-1 border rounded h-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <textarea
                id="descripcion"
                value={configuracionPWA.descripcionLarga}
                onChange={(e) => setConfiguracionPWA({...configuracionPWA, descripcionLarga: e.target.value})}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Pantalla de Splash</Label>
                <Switch
                  checked={configuracionPWA.pantallaSplash}
                  onCheckedChange={(checked) => 
                    setConfiguracionPWA({...configuracionPWA, pantallaSplash: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Notificaciones Push</Label>
                <Switch
                  checked={configuracionPWA.notificacionesPush}
                  onCheckedChange={(checked) => 
                    setConfiguracionPWA({...configuracionPWA, notificacionesPush: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Instalación Automática</Label>
                <Switch
                  checked={configuracionPWA.instalacionAutomatica}
                  onCheckedChange={(checked) => 
                    setConfiguracionPWA({...configuracionPWA, instalacionAutomatica: checked})
                  }
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowConfiguracion(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowConfiguracion(false)}>
              Guardar Configuración
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OptimizacionesAvanzadasComponent;