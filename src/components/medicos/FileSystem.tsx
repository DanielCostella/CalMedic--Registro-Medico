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

interface MedicalFile {
    id: string;
    name: string;
    type: 'image' | 'document' | 'laboratory' | 'radiology' | 'other';
    extension: string;
    size: number; // in bytes
    uploadDate: string;
    creationDate?: string;
    patientId: string;
    patientName: string;
    category: string;
    description: string;
    tags: string[];
    url: string; // File URL
    thumbnail?: string; // Thumbnail URL for images
    metadata: {
        resolution?: string;
        duration?: string;
        pages?: number;
        author?: string;
    };
}

interface VirtualFolder {
    id: string;
    name: string;
    description: string;
    color: string;
    files: string[]; // File IDs
    creationDate: string;
}

const FileSystem: React.FC = () => {
    const [files, setFiles] = useState<MedicalFile[]>([]);
    const [folders, setFolders] = useState<VirtualFolder[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showViewer, setShowViewer] = useState(false);
    const [selectedFile, setSelectedFile] = useState<MedicalFile | null>(null);
    const [showNewFolder, setShowNewFolder] = useState(false);
    const [activeFolder, setActiveFolder] = useState<string>('all');

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

    const [newFolder, setNewFolder] = useState({
        name: '',
        description: '',
        color: '#3B82F6'
    });

    const [newFileForm, setNewFileForm] = useState({
        patientId: '',
        patientName: '',
        category: '',
        description: '',
        tags: [] as string[],
        newTag: ''
    });

    useEffect(() => {
        // Mock file loading
        setTimeout(() => {
            const initialFiles: MedicalFile[] = [
                {
                    id: '1',
                    name: 'Chest_Xray_Maria_Gonzalez.jpg',
                    type: 'image',
                    extension: 'jpg',
                    size: 2048000, // 2MB
                    uploadDate: '2024-01-15',
                    creationDate: '2024-01-15',
                    patientId: '1',
                    patientName: 'Maria Gonzalez',
                    category: 'Radiology',
                    description: 'Chest X-ray PA and lateral',
                    tags: ['x-ray', 'chest', 'follow-up'],
                    url: '/api/files/1',
                    thumbnail: '/api/thumbnails/1',
                    metadata: {
                        resolution: '2048x1536',
                        author: 'Dr. Radiologist'
                    }
                },
                {
                    id: '2',
                    name: 'Laboratory_Blood_Count_Carlos_Rodriguez.pdf',
                    type: 'document',
                    extension: 'pdf',
                    size: 512000, // 512KB
                    uploadDate: '2024-01-14',
                    creationDate: '2024-01-14',
                    patientId: '2',
                    patientName: 'Carlos Rodriguez',
                    category: 'Laboratory',
                    description: 'Complete blood count with differential',
                    tags: ['blood count', 'laboratory', 'blood'],
                    url: '/api/files/2',
                    metadata: {
                        pages: 2,
                        author: 'Central Lab'
                    }
                },
                {
                    id: '3',
                    name: 'Abdominal_Ultrasound_Ana_Martinez.dcm',
                    type: 'image',
                    extension: 'dcm',
                    size: 15728640, // 15MB
                    uploadDate: '2024-01-13',
                    creationDate: '2024-01-13',
                    patientId: '3',
                    patientName: 'Ana Martinez',
                    category: 'Ultrasound',
                    description: 'Complete abdominal ultrasound',
                    tags: ['ultrasound', 'abdomen', 'diagnosis'],
                    url: '/api/files/3',
                    thumbnail: '/api/thumbnails/3',
                    metadata: {
                        resolution: '1024x768',
                        author: 'Dr. Sonographer'
                    }
                },
                {
                    id: '4',
                    name: 'Medical_History_Luis_Garcia.docx',
                    type: 'document',
                    extension: 'docx',
                    size: 1024000, // 1MB
                    uploadDate: '2024-01-12',
                    creationDate: '2024-01-12',
                    patientId: '4',
                    patientName: 'Luis Garcia',
                    category: 'Medical History',
                    description: 'Complete medical history - First consultation',
                    tags: ['history', 'first visit', 'anamnesis'],
                    url: '/api/files/4',
                    metadata: {
                        pages: 5,
                        author: 'System Dr.'
                    }
                },
                {
                    id: '5',
                    name: 'Cerebral_CT_Elena_Torres.zip',
                    type: 'radiology',
                    extension: 'zip',
                    size: 52428800, // 50MB
                    uploadDate: '2024-01-11',
                    creationDate: '2024-01-11',
                    patientId: '5',
                    patientName: 'Elena Torres',
                    category: 'CT Scan',
                    description: 'Non-contrast cerebral CT - Complete series',
                    tags: ['ct', 'brain', 'neurology'],
                    url: '/api/files/5',
                    metadata: {
                        author: 'Radiology Service'
                    }
                }
            ];

            const initialFolders: VirtualFolder[] = [
                {
                    id: '1',
                    name: 'Radiology',
                    description: 'Radiological and imaging studies',
                    color: '#3B82F6',
                    files: ['1', '3', '5'],
                    creationDate: '2024-01-01'
                },
                {
                    id: '2',
                    name: 'Laboratory',
                    description: 'Laboratory test results',
                    color: '#10B981',
                    files: ['2'],
                    creationDate: '2024-01-01'
                },
                {
                    id: '3',
                    name: 'Medical Histories',
                    description: 'Medical history documents',
                    color: '#F59E0B',
                    files: ['4'],
                    creationDate: '2024-01-01'
                }
            ];

            setFiles(initialFiles);
            setFolders(initialFolders);
            setLoading(false);
        }, 1000);
    }, []);

    const handleFileUpload = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];

            // Simulate upload progress
            for (let progress = 0; progress <= 100; progress += 10) {
                setUploadProgress(progress);
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Determine file type
            let type: MedicalFile['type'] = 'other';
            if (file.type.startsWith('image/')) {
                type = 'image';
            } else if (file.type === 'application/pdf' || file.type.includes('document')) {
                type = 'document';
            } else if (file.name.toLowerCase().includes('lab')) {
                type = 'laboratory';
            } else if (file.name.toLowerCase().includes('radio') || file.name.toLowerCase().includes('ct') || file.name.toLowerCase().includes('mri')) {
                type = 'radiology';
            }

            const completedNewFile: MedicalFile = {
                id: Date.now().toString() + i,
                name: file.name,
                type,
                extension: file.name.split('.').pop() || '',
                size: file.size,
                uploadDate: new Date().toISOString().split('T')[0],
                patientId: newFileForm.patientId,
                patientName: newFileForm.patientName,
                category: newFileForm.category,
                description: newFileForm.description,
                tags: newFileForm.tags,
                url: URL.createObjectURL(file),
                thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
                metadata: {
                    resolution: file.type.startsWith('image/') ? 'Calculating...' : undefined,
                    author: 'User'
                }
            };

            setFiles(prev => [...prev, completedNewFile]);
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

    const getFileIcon = (type: MedicalFile['type'], extension: string) => {
        switch (type) {
            case 'image':
                return <Image className="w-8 h-8 text-blue-600" />;
            case 'document':
                return <FileText className="w-8 h-8 text-red-600" />;
            case 'laboratory':
                return <File className="w-8 h-8 text-green-600" />;
            case 'radiology':
                return <File className="w-8 h-8 text-purple-600" />;
            default:
                return <File className="w-8 h-8 text-gray-600" />;
        }
    };

    const deleteFile = (id: string) => {
        if (confirm('Are you sure you want to delete this file?')) {
            setFiles(prev => prev.filter(f => f.id !== id));
            // Also remove from folders
            setFolders(prev => prev.map(folder => ({
                ...folder,
                files: folder.files.filter(fileId => fileId !== id)
            })));
        }
    };

    const createFolder = () => {
        const folder: VirtualFolder = {
            id: Date.now().toString(),
            name: newFolder.name,
            description: newFolder.description,
            color: newFolder.color,
            files: [],
            creationDate: new Date().toISOString().split('T')[0]
        };

        setFolders(prev => [...prev, folder]);
        setShowNewFolder(false);
        setNewFolder({ name: '', description: '', color: '#3B82F6' });
    };

    const addTag = () => {
        if (newFileForm.newTag.trim() && !newFileForm.tags.includes(newFileForm.newTag.trim())) {
            setNewFileForm(prev => ({
                ...prev,
                tags: [...prev.tags, prev.newTag.trim()],
                newTag: ''
            }));
        }
    };

    const deleteTag = (tag: string) => {
        setNewFileForm(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const filteredFiles = files.filter(file => {
        const matchSearch = !search ||
            file.name.toLowerCase().includes(search.toLowerCase()) ||
            file.description.toLowerCase().includes(search.toLowerCase()) ||
            file.patientName.toLowerCase().includes(search.toLowerCase()) ||
            file.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

        const matchType = !typeFilter || file.type === typeFilter;
        const matchCategory = !categoryFilter || file.category === categoryFilter;
        const matchDate = !dateFilter || file.uploadDate === dateFilter;

        // Filter by folder
        let matchFolder = true;
        if (activeFolder !== 'all') {
            const folder = folders.find(f => f.id === activeFolder);
            matchFolder = folder ? folder.files.includes(file.id) : false;
        }

        return matchSearch && matchType && matchCategory && matchDate && matchFolder;
    });

    const categories = [...new Set(files.map(f => f.category))];

    if (loading) {
        return (
            <div className="p-6">
                <LoadingSpinner size="lg" text="Loading file system..." />
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
                        Medical File System
                    </h1>
                    <p className="text-gray-600">
                        Centralized management of medical documents and images
                    </p>
                </div>

                <div className="flex gap-2">
                    <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <FolderOpen className="w-4 h-4 mr-2" />
                                New Folder
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Folder</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="folder-name">Folder Name</Label>
                                    <Input
                                        id="folder-name"
                                        value={newFolder.name}
                                        onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                                        placeholder="e.g.: Cardiology"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="folder-description">Description</Label>
                                    <Textarea
                                        id="folder-description"
                                        value={newFolder.description}
                                        onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                                        placeholder="Folder description..."
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="folder-color">Color</Label>
                                    <Input
                                        id="folder-color"
                                        type="color"
                                        value={newFolder.color}
                                        onChange={(e) => setNewFolder({ ...newFolder, color: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setShowNewFolder(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={createFolder} disabled={!newFolder.name}>
                                    Create Folder
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
                            Upload Files
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress bar for upload */}
            {uploading && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Upload className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Uploading files...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} className="w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total Files</p>
                                <p className="text-2xl font-bold">{files.length}</p>
                            </div>
                            <File className="w-8 h-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Images</p>
                                <p className="text-2xl font-bold">
                                    {files.filter(f => f.type === 'image').length}
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
                                <p className="text-orange-100">Documents</p>
                                <p className="text-2xl font-bold">
                                    {files.filter(f => f.type === 'document').length}
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
                                <p className="text-purple-100">Folders</p>
                                <p className="text-2xl font-bold">{folders.length}</p>
                            </div>
                            <FolderOpen className="w-8 h-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Folders */}
            <Card>
                <CardHeader>
                    <CardTitle>Folders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        <Button
                            variant={activeFolder === 'all' ? 'default' : 'outline'}
                            onClick={() => setActiveFolder('all')}
                            className="whitespace-nowrap"
                        >
                            <FolderOpen className="w-4 h-4 mr-2" />
                            All Files ({files.length})
                        </Button>
                        {folders.map(folder => (
                            <Button
                                key={folder.id}
                                variant={activeFolder === folder.id ? 'default' : 'outline'}
                                onClick={() => setActiveFolder(folder.id)}
                                className="whitespace-nowrap"
                                style={{
                                    backgroundColor: activeFolder === folder.id ? folder.color : undefined,
                                    borderColor: folder.color
                                }}
                            >
                                <FolderOpen className="w-4 h-4 mr-2" />
                                {folder.name} ({folder.files.length})
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters and search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search files by name, description, patient or tags..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All</SelectItem>
                                    <SelectItem value="image">Images</SelectItem>
                                    <SelectItem value="document">Documents</SelectItem>
                                    <SelectItem value="laboratory">Laboratory</SelectItem>
                                    <SelectItem value="radiology">Radiology</SelectItem>
                                    <SelectItem value="other">Others</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-40"
                            />

                            <div className="flex border rounded-md">
                                <Button
                                    variant={currentView === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setCurrentView('grid')}
                                    className="rounded-r-none"
                                >
                                    Grid
                                </Button>
                                <Button
                                    variant={currentView === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setCurrentView('list')}
                                    className="rounded-l-none"
                                >
                                    List
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* File List/Grid */}
            <div className={currentView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
                {filteredFiles.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="p-8 text-center text-gray-500">
                            <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No files found matching the filters</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredFiles.map(file => (
                        <Card key={file.id} className={`hover:shadow-lg transition-shadow ${currentView === 'list' ? 'w-full' : ''}`}>
                            <CardContent className={`p-4 ${currentView === 'list' ? 'flex items-center gap-4' : ''}`}>
                                {currentView === 'grid' ? (
                                    // Grid View
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            {getFileIcon(file.type, file.extension)}
                                            <Badge variant="outline" className="text-xs">
                                                {file.extension.toUpperCase()}
                                            </Badge>
                                        </div>

                                        {file.thumbnail && (
                                            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={file.thumbnail}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="font-medium text-sm truncate" title={file.name}>
                                                {file.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {file.patientName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {file.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {file.tags.slice(0, 2).map(tag => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {file.tags.length > 2 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{file.tags.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedFile(file);
                                                    setShowViewer(true);
                                                }}
                                                className="flex-1"
                                            >
                                                <Eye className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    // Simulate download
                                                    const link = document.createElement('a');
                                                    link.href = file.url;
                                                    link.download = file.name;
                                                    link.click();
                                                }}
                                            >
                                                <Download className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => deleteFile(file.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // List View
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4 flex-1">
                                            {getFileIcon(file.type, file.extension)}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate">{file.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>{file.patientName}</span>
                                                    <span>{formatFileSize(file.size)}</span>
                                                    <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {file.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedFile(file);
                                                    setShowViewer(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = file.url;
                                                    link.download = file.name;
                                                    link.click();
                                                }}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => deleteFile(file.id)}
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

            {/* File Viewer */}
            <Dialog open={showViewer} onOpenChange={setShowViewer}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedFile && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {getFileIcon(selectedFile.type, selectedFile.extension)}
                                    {selectedFile.name}
                                </DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="view" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="view">Preview</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                </TabsList>

                                <TabsContent value="view" className="space-y-4">
                                    <div className="border rounded-lg p-4 bg-gray-50 min-h-96 flex items-center justify-center">
                                        {selectedFile.type === 'image' && selectedFile.thumbnail ? (
                                            <img
                                                src={selectedFile.thumbnail}
                                                alt={selectedFile.name}
                                                className="max-w-full max-h-96 object-contain"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                {getFileIcon(selectedFile.type, selectedFile.extension)}
                                                <p className="mt-4 text-gray-600">
                                                    Preview not available for this file type
                                                </p>
                                                <Button className="mt-4" onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = selectedFile.url;
                                                    link.download = selectedFile.name;
                                                    link.click();
                                                }}>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download File
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="details" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold">General Information</h4>
                                            <div><strong>Name:</strong> {selectedFile.name}</div>
                                            <div><strong>Type:</strong> {selectedFile.type}</div>
                                            <div><strong>Size:</strong> {formatFileSize(selectedFile.size)}</div>
                                            <div><strong>Extension:</strong> {selectedFile.extension.toUpperCase()}</div>
                                            <div><strong>Upload Date:</strong> {new Date(selectedFile.uploadDate).toLocaleDateString()}</div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-semibold">Medical Information</h4>
                                            <div><strong>Patient:</strong> {selectedFile.patientName}</div>
                                            <div><strong>Category:</strong> {selectedFile.category}</div>
                                            <div><strong>Description:</strong> {selectedFile.description}</div>
                                        </div>
                                    </div>

                                    {selectedFile.tags.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedFile.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary">
                                                        <Tag className="w-3 h-3 mr-1" />
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {Object.keys(selectedFile.metadata).length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Metadata</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                {selectedFile.metadata.resolution && (
                                                    <div><strong>Resolution:</strong> {selectedFile.metadata.resolution}</div>
                                                )}
                                                {selectedFile.metadata.pages && (
                                                    <div><strong>Pages:</strong> {selectedFile.metadata.pages}</div>
                                                )}
                                                {selectedFile.metadata.author && (
                                                    <div><strong>Author:</strong> {selectedFile.metadata.author}</div>
                                                )}
                                                {selectedFile.metadata.duration && (
                                                    <div><strong>Duration:</strong> {selectedFile.metadata.duration}</div>
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
                                        link.href = selectedFile.url;
                                        link.download = selectedFile.name;
                                        link.click();
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FileSystem;
