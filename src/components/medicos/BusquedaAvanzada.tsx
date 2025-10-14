import React, { useState, useEffect } from 'react';
import { Search, Filter, Mic, X, Clock, TrendingUp, User, Calendar, FileText, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { searchService, useSearch } from '@/lib/searchService';
import { mockPacientes, mockMedicos, mockCitas, mockHistorialMedico, mockRecetas } from '@/data/mockData';
import { FiltrosBusqueda, ResultadoBusqueda } from '@/types/medical';

const BusquedaAvanzada: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filtrosAvanzados, setFiltrosAvanzados] = useState<FiltrosBusqueda>({});
  const [tiposBusqueda, setTiposBusqueda] = useState<string[]>(['general']);
  const [showFiltros, setShowFiltros] = useState(false);
  const [busquedaPorVoz, setBusquedaPorVoz] = useState(false);
  const [historialBusquedas, setHistorialBusquedas] = useState<string[]>([]);
  const [sugerenciasAutocompletado, setSugerenciasAutocompletado] = useState<string[]>([]);

  const { resultados, cargando, sugerencias, buscar, obtenerSugerencias } = useSearch();

  // Datos combinados para búsqueda
  const todosDatos = {
    pacientes: mockPacientes,
    medicos: mockMedicos,
    citas: mockCitas,
    historiales: mockHistorialMedico,
    recetas: mockRecetas
  };

  useEffect(() => {
    // Cargar historial de búsquedas del localStorage
    const historial = localStorage.getItem('historialBusquedas');
    if (historial) {
      setHistorialBusquedas(JSON.parse(historial));
    }
  }, []);

  useEffect(() => {
    // Obtener sugerencias cuando cambia el query
    if (query.length > 2) {
      obtenerSugerencias(query);
      
      // Autocompletado
      const autocompletado = searchService.obtenerAutocompletado(query, [
        ...mockPacientes,
        ...mockMedicos
      ]);
      setSugerenciasAutocompletado(autocompletado);
    } else {
      setSugerenciasAutocompletado([]);
    }
  }, [query, obtenerSugerencias]);

  const handleBuscar = async () => {
    if (query.trim()) {
      // Guardar en historial
      const nuevoHistorial = [query, ...historialBusquedas.filter(h => h !== query)].slice(0, 10);
      setHistorialBusquedas(nuevoHistorial);
      localStorage.setItem('historialBusquedas', JSON.stringify(nuevoHistorial));

      // Realizar búsqueda
      const tipoBusqueda = tiposBusqueda.includes('general') ? 'general' : tiposBusqueda[0];
      await buscar(query, todosDatos, tipoBusqueda, filtrosAvanzados);
    }
  };

  const handleBusquedaPorVoz = async () => {
    setBusquedaPorVoz(true);
    try {
      const texto = await searchService.busquedaPorVoz();
      setQuery(texto);
      setBusquedaPorVoz(false);
      // Buscar automáticamente después del reconocimiento
      setTimeout(() => handleBuscar(), 500);
    } catch (error) {
      console.error('Error en búsqueda por voz:', error);
      setBusquedaPorVoz(false);
      alert('Error en el reconocimiento de voz. Verifique que su navegador soporte esta función.');
    }
  };

  const limpiarFiltros = () => {
    setFiltrosAvanzados({});
    setTiposBusqueda(['general']);
  };

  const aplicarFiltroRapido = (filtro: string, valor: string) => {
    setFiltrosAvanzados(prev => ({ ...prev, [filtro]: valor }));
    handleBuscar();
  };

  const getIconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'Paciente': return <User className="w-4 h-4" />;
      case 'Medico': return <User className="w-4 h-4" />;
      case 'Cita': return <Calendar className="w-4 h-4" />;
      case 'Historial': return <FileText className="w-4 h-4" />;
      case 'Receta': return <Pill className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getColorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'Paciente': return 'bg-blue-100 text-blue-800';
      case 'Medico': return 'bg-green-100 text-green-800';
      case 'Cita': return 'bg-purple-100 text-purple-800';
      case 'Historial': return 'bg-orange-100 text-orange-800';
      case 'Receta': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Búsqueda Avanzada</h1>
          <p className="text-gray-600">Motor de búsqueda inteligente con IA</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => searchService.limpiarHistorial()}
          >
            Limpiar Historial
          </Button>
          
          <Dialog open={showFiltros} onOpenChange={setShowFiltros}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avanzados
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Filtros Avanzados de Búsqueda</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="fechas">Fechas</TabsTrigger>
                  <TabsTrigger value="especificos">Específicos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div>
                    <Label>Tipos de búsqueda</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['general', 'pacientes', 'medicos', 'citas', 'historiales', 'recetas'].map(tipo => (
                        <Button
                          key={tipo}
                          variant={tiposBusqueda.includes(tipo) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (tipo === 'general') {
                              setTiposBusqueda(['general']);
                            } else {
                              setTiposBusqueda(prev => 
                                prev.includes(tipo) 
                                  ? prev.filter(t => t !== tipo && t !== 'general')
                                  : [...prev.filter(t => t !== 'general'), tipo]
                              );
                            }
                          }}
                        >
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Select 
                        value={filtrosAvanzados.estado || 'todos'} 
                        onValueChange={(value) => setFiltrosAvanzados(prev => ({ ...prev, estado: value === 'todos' ? undefined : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                          <SelectItem value="Programada">Programada</SelectItem>
                          <SelectItem value="Completada">Completada</SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Select 
                        value={filtrosAvanzados.especialidad || 'todas'} 
                        onValueChange={(value) => setFiltrosAvanzados(prev => ({ ...prev, especialidad: value === 'todas' ? undefined : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas</SelectItem>
                          <SelectItem value="Cardiología">Cardiología</SelectItem>
                          <SelectItem value="Pediatría">Pediatría</SelectItem>
                          <SelectItem value="Medicina General">Medicina General</SelectItem>
                          <SelectItem value="Ginecología">Ginecología</SelectItem>
                          <SelectItem value="Dermatología">Dermatología</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="fechas" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fechaInicio">Fecha inicio</Label>
                      <Input
                        type="date"
                        value={filtrosAvanzados.fechaInicio || ''}
                        onChange={(e) => setFiltrosAvanzados(prev => ({ ...prev, fechaInicio: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fechaFin">Fecha fin</Label>
                      <Input
                        type="date"
                        value={filtrosAvanzados.fechaFin || ''}
                        onChange={(e) => setFiltrosAvanzados(prev => ({ ...prev, fechaFin: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const hoy = new Date().toISOString().split('T')[0];
                        setFiltrosAvanzados(prev => ({ ...prev, fechaInicio: hoy, fechaFin: hoy }));
                      }}
                    >
                      Hoy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const hoy = new Date();
                        const semanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
                        setFiltrosAvanzados(prev => ({ 
                          ...prev, 
                          fechaInicio: semanaAtras.toISOString().split('T')[0],
                          fechaFin: hoy.toISOString().split('T')[0]
                        }));
                      }}
                    >
                      Última semana
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const hoy = new Date();
                        const mesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
                        setFiltrosAvanzados(prev => ({ 
                          ...prev, 
                          fechaInicio: mesAtras.toISOString().split('T')[0],
                          fechaFin: hoy.toISOString().split('T')[0]
                        }));
                      }}
                    >
                      Último mes
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="especificos" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="diagnostico">Diagnóstico</Label>
                      <Input
                        placeholder="Buscar por diagnóstico..."
                        value={filtrosAvanzados.diagnostico || ''}
                        onChange={(e) => setFiltrosAvanzados(prev => ({ ...prev, diagnostico: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="medicamento">Medicamento</Label>
                      <Input
                        placeholder="Buscar por medicamento..."
                        value={filtrosAvanzados.medicamento || ''}
                        onChange={(e) => setFiltrosAvanzados(prev => ({ ...prev, medicamento: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Select 
                      value={filtrosAvanzados.prioridad || 'todas'} 
                      onValueChange={(value) => setFiltrosAvanzados(prev => ({ ...prev, prioridad: value === 'todas' ? undefined : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={limpiarFiltros}>
                  Limpiar
                </Button>
                <Button onClick={() => { handleBuscar(); setShowFiltros(false); }}>
                  Aplicar Filtros
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Barra de búsqueda principal */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar pacientes, médicos, citas, historiales, recetas..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                className="pl-10 text-lg h-12"
              />
              
              {/* Sugerencias de autocompletado */}
              {sugerenciasAutocompletado.length > 0 && (
                <div className="absolute top-14 left-0 right-0 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {sugerenciasAutocompletado.map((sugerencia, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setQuery(sugerencia);
                        setSugerenciasAutocompletado([]);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{sugerencia}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              onClick={handleBusquedaPorVoz}
              variant="outline"
              disabled={busquedaPorVoz}
              className="h-12"
            >
              <Mic className={`w-5 h-5 ${busquedaPorVoz ? 'text-red-500 animate-pulse' : ''}`} />
            </Button>
            
            <Button onClick={handleBuscar} disabled={cargando} className="h-12 px-8">
              {cargando ? <LoadingSpinner size="sm" /> : 'Buscar'}
            </Button>
          </div>
          
          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-600 mr-2">Filtros rápidos:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => aplicarFiltroRapido('estado', 'Activo')}
            >
              Activos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => aplicarFiltroRapido('especialidad', 'Cardiología')}
            >
              Cardiología
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => aplicarFiltroRapido('especialidad', 'Pediatría')}
            >
              Pediatría
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const hoy = new Date().toISOString().split('T')[0];
                aplicarFiltroRapido('fechaInicio', hoy);
              }}
            >
              Hoy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de búsquedas */}
      {historialBusquedas.length > 0 && !query && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Búsquedas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {historialBusquedas.slice(0, 8).map((busqueda, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(busqueda);
                    handleBuscar();
                  }}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-3 h-3" />
                  {busqueda}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados de búsqueda */}
      {cargando && (
        <Card>
          <CardContent className="p-8 text-center">
            <LoadingSpinner size="lg" text="Buscando..." />
          </CardContent>
        </Card>
      )}

      {!cargando && resultados.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Resultados de búsqueda ({resultados.length})
            </h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">
                Ordenado por relevancia
              </span>
            </div>
          </div>
          
          {resultados.map((resultado, index) => (
            <Card key={`${resultado.tipo}-${resultado.id}`} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getColorPorTipo(resultado.tipo)}>
                        {getIconoPorTipo(resultado.tipo)}
                        <span className="ml-1">{resultado.tipo}</span>
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          {Math.round(resultado.relevancia)}% relevancia
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resultado.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {resultado.subtitulo}
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      {resultado.descripcion}
                    </p>
                    
                    {resultado.coincidencias.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs text-gray-500 mr-1">Coincidencias:</span>
                        {resultado.coincidencias.map((coincidencia, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {coincidencia}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Fecha: {new Date(resultado.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Aquí iría la lógica para ver el detalle
                        console.log('Ver detalle:', resultado);
                      }}
                    >
                      Ver Detalle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!cargando && query && resultados.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No se encontraron resultados</p>
            <p className="text-sm">
              Intenta con términos diferentes o ajusta los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sugerencias de búsqueda */}
      {sugerencias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sugerencias Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sugerencias.map((sugerencia, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(sugerencia.texto);
                    handleBuscar();
                  }}
                  className="flex items-center gap-2"
                >
                  <span>{sugerencia.texto}</span>
                  <Badge variant="secondary" className="text-xs">
                    {sugerencia.frecuencia}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusquedaAvanzada;