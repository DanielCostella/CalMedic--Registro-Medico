import React, { useState, useEffect } from 'react';
import { Users, Shield, Key, Eye, EyeOff, Plus, Edit, Trash2, Search, Filter, UserCheck, Settings, Lock, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'Administrator' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Lab Technician';
    specialty?: string;
    medicalLicense?: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    creationDate: string;
    lastAccess: string;
    permissions: string[];
    twoFactorAuth: boolean;
    avatar?: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    color: string;
    active: boolean;
}

interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
    level: 'Read' | 'Write' | 'Administration';
}

interface ActiveSession {
    id: string;
    userId: string;
    userName: string;
    device: string;
    browser: string;
    ip: string;
    startTime: string;
    lastActivity: string;
    location: string;
}

const UserManagementSystem: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewUser, setShowNewUser] = useState(false);
    const [showNewRole, setShowNewRole] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [newUser, setNewUser] = useState<Omit<User, 'id' | 'creationDate' | 'lastAccess'>>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Doctor',
        specialty: '',
        medicalLicense: '',
        status: 'Active',
        permissions: [],
        twoFactorAuth: false
    });

    const [newRole, setNewRole] = useState<Omit<Role, 'id'>>({
        name: '',
        description: '',
        permissions: [],
        color: '#3B82F6',
        active: true
    });

    const [temporaryPassword, setTemporaryPassword] = useState('');

    useEffect(() => {
        // Mock data loading
        setTimeout(() => {
            const initialPermissions: Permission[] = [
                // Patients Module
                { id: '1', name: 'View Patients', description: 'View list of patients', module: 'Patients', level: 'Read' },
                { id: '2', name: 'Create Patients', description: 'Register new patients', module: 'Patients', level: 'Write' },
                { id: '3', name: 'Edit Patients', description: 'Modify patient data', module: 'Patients', level: 'Write' },
                { id: '4', name: 'Delete Patients', description: 'Remove patient records', module: 'Patients', level: 'Administration' },

                // Appointments Module
                { id: '5', name: 'View Appointments', description: 'View appointment calendar', module: 'Appointments', level: 'Read' },
                { id: '6', name: 'Schedule Appointments', description: 'Create new appointments', module: 'Appointments', level: 'Write' },
                { id: '7', name: 'Modify Appointments', description: 'Change schedules and statuses', module: 'Appointments', level: 'Write' },
                { id: '8', name: 'Cancel Appointments', description: 'Cancel scheduled appointments', module: 'Appointments', level: 'Write' },

                // Medical History Module
                { id: '9', name: 'View History', description: 'Access medical records', module: 'History', level: 'Read' },
                { id: '10', name: 'Create History', description: 'Log new consultations', module: 'History', level: 'Write' },
                { id: '11', name: 'Edit History', description: 'Modify medical records', module: 'History', level: 'Write' },

                // Prescriptions Module
                { id: '12', name: 'View Prescriptions', description: 'View issued prescriptions', module: 'Prescriptions', level: 'Read' },
                { id: '13', name: 'Create Prescriptions', description: 'Issue new prescriptions', module: 'Prescriptions', level: 'Write' },
                { id: '14', name: 'Print Prescriptions', description: 'Generate physical prescriptions', module: 'Prescriptions', level: 'Write' },

                // Laboratories Module
                { id: '15', name: 'View Results', description: 'Access lab results', module: 'Laboratories', level: 'Read' },
                { id: '16', name: 'Manage Laboratories', description: 'Configure connections', module: 'Laboratories', level: 'Administration' },

                // System Module
                { id: '17', name: 'Manage Users', description: 'Administer user accounts', module: 'System', level: 'Administration' },
                { id: '18', name: 'Configure Backup', description: 'Manage backups', module: 'System', level: 'Administration' },
                { id: '19', name: 'View Reports', description: 'Access system reports', module: 'System', level: 'Read' },
                { id: '20', name: 'Generate Reports', description: 'Create custom reports', module: 'System', level: 'Write' }
            ];

            const initialRoles: Role[] = [
                {
                    id: '1',
                    name: 'Administrator',
                    description: 'Full system access',
                    permissions: initialPermissions.map(p => p.id),
                    color: '#EF4444',
                    active: true
                },
                {
                    id: '2',
                    name: 'Doctor',
                    description: 'Access to main medical functions',
                    permissions: ['1', '2', '3', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '19'],
                    color: '#3B82F6',
                    active: true
                },
                {
                    id: '3',
                    name: 'Nurse',
                    description: 'Support in medical care',
                    permissions: ['1', '5', '6', '7', '9', '15', '19'],
                    color: '#10B981',
                    active: true
                },
                {
                    id: '4',
                    name: 'Receptionist',
                    description: 'Appointment and patient management',
                    permissions: ['1', '2', '3', '5', '6', '7', '8'],
                    color: '#F59E0B',
                    active: true
                },
                {
                    id: '5',
                    name: 'Lab Technician',
                    description: 'Lab results management',
                    permissions: ['1', '15', '16'],
                    color: '#8B5CF6',
                    active: true
                }
            ];

            const initialUsers: User[] = [
                {
                    id: '1',
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan.perez@clinica.com',
                    phone: '+1234567890',
                    role: 'Doctor',
                    specialty: 'Cardiology',
                    medicalLicense: 'LIC-12345',
                    status: 'Active',
                    creationDate: '2024-01-01',
                    lastAccess: '2024-01-16 14:30:00',
                    permissions: initialRoles.find(r => r.name === 'Doctor')?.permissions || [],
                    twoFactorAuth: true
                },
                {
                    id: '2',
                    firstName: 'María',
                    lastName: 'González',
                    email: 'maria.gonzalez@clinica.com',
                    phone: '+1234567891',
                    role: 'Doctor',
                    specialty: 'Pediatrics',
                    medicalLicense: 'LIC-12346',
                    status: 'Active',
                    creationDate: '2024-01-02',
                    lastAccess: '2024-01-16 13:45:00',
                    permissions: initialRoles.find(r => r.name === 'Doctor')?.permissions || [],
                    twoFactorAuth: false
                },
                {
                    id: '3',
                    firstName: 'Ana',
                    lastName: 'Martínez',
                    email: 'ana.martinez@clinica.com',
                    phone: '+1234567892',
                    role: 'Nurse',
                    status: 'Active',
                    creationDate: '2024-01-03',
                    lastAccess: '2024-01-16 15:20:00',
                    permissions: initialRoles.find(r => r.name === 'Nurse')?.permissions || [],
                    twoFactorAuth: false
                },
                {
                    id: '4',
                    firstName: 'Carlos',
                    lastName: 'Rodríguez',
                    email: 'carlos.rodriguez@clinica.com',
                    phone: '+1234567893',
                    role: 'Receptionist',
                    status: 'Active',
                    creationDate: '2024-01-04',
                    lastAccess: '2024-01-16 12:15:00',
                    permissions: initialRoles.find(r => r.name === 'Receptionist')?.permissions || [],
                    twoFactorAuth: false
                },
                {
                    id: '5',
                    firstName: 'System',
                    lastName: 'Admin',
                    email: 'admin@clinica.com',
                    phone: '+1234567894',
                    role: 'Administrator',
                    status: 'Active',
                    creationDate: '2024-01-01',
                    lastAccess: '2024-01-16 16:00:00',
                    permissions: initialRoles.find(r => r.name === 'Administrator')?.permissions || [],
                    twoFactorAuth: true
                }
            ];

            const initialSessions: ActiveSession[] = [
                {
                    id: '1',
                    userId: '1',
                    userName: 'Dr. Juan Pérez',
                    device: 'Desktop',
                    browser: 'Chrome 120.0',
                    ip: '192.168.1.100',
                    startTime: '2024-01-16 08:00:00',
                    lastActivity: '2024-01-16 14:30:00',
                    location: 'Office 1'
                },
                {
                    id: '2',
                    userId: '2',
                    userName: 'Dra. María González',
                    device: 'Tablet',
                    browser: 'Safari 17.2',
                    ip: '192.168.1.101',
                    startTime: '2024-01-16 09:15:00',
                    lastActivity: '2024-01-16 13:45:00',
                    location: 'Office 2'
                },
                {
                    id: '3',
                    userId: '3',
                    userName: 'Ana Martínez',
                    device: 'Mobile',
                    browser: 'Chrome Mobile 120.0',
                    ip: '192.168.1.102',
                    startTime: '2024-01-16 07:30:00',
                    lastActivity: '2024-01-16 15:20:00',
                    location: 'Nursing Station'
                }
            ];

            setPermissions(initialPermissions);
            setRoles(initialRoles);
            setUsers(initialUsers);
            setActiveSessions(initialSessions);
            setLoading(false);
        }, 1000);
    }, []);

    const createUser = () => {
        const user: User = {
            ...newUser,
            id: Date.now().toString(),
            creationDate: new Date().toISOString().split('T')[0],
            lastAccess: 'Never',
            permissions: roles.find(r => r.name === newUser.role)?.permissions || []
        };

        setUsers(prev => [...prev, user]);
        setShowNewUser(false);
        resetUserForm();

        // Generate temporary password
        const tempPass = generateTemporaryPassword();
        setTemporaryPassword(tempPass);
        alert(`User created successfully.\nTemporary password: ${tempPass}\nThe user must change it on first access.`);
    };

    const createRole = () => {
        const role: Role = {
            ...newRole,
            id: Date.now().toString()
        };

        setRoles(prev => [...prev, role]);
        setShowNewRole(false);
        resetRoleForm();
    };

    const resetUserForm = () => {
        setNewUser({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'Doctor',
            specialty: '',
            medicalLicense: '',
            status: 'Active',
            permissions: [],
            twoFactorAuth: false
        });
    };

    const resetRoleForm = () => {
        setNewRole({
            name: '',
            description: '',
            permissions: [],
            color: '#3B82F6',
            active: true
        });
    };

    const generateTemporaryPassword = (): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const changeUserStatus = (userId: string, newStatus: User['status']) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, status: newStatus } : u
        ));
    };

    const resetPassword = (userId: string) => {
        const tempPass = generateTemporaryPassword();
        setTemporaryPassword(tempPass);
        alert(`New temporary password generated: ${tempPass}\nThe user must change it upon next access.`);
    };

    const terminateSession = (sessionId: string) => {
        if (confirm('Are you sure you want to close this session?')) {
            setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
        }
    };

    const deleteUser = (userId: string) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    const filteredUsers = users.filter(user => {
        const matchSearch = !search ||
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());

        const matchRole = !roleFilter || user.role === roleFilter;
        const matchStatus = !statusFilter || user.status === statusFilter;

        return matchSearch && matchRole && matchStatus;
    });

    const getRoleColor = (roleName: string) => {
        const roleObj = roles.find(r => r.name === roleName);
        return roleObj?.color || '#6B7280';
    };

    const getRolePermissions = (roleName: string) => {
        const role = roles.find(r => r.name === roleName);
        return role?.permissions || [];
    };

    const modules = [...new Set(permissions.map(p => p.module))];

    if (loading) {
        return (
            <div className="p-6">
                <LoadingSpinner size="lg" text="Loading user system..." />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-8 h-8 text-blue-600" />
                        User & Permissions System
                    </h1>
                    <p className="text-gray-600">
                        Complete management of users, roles, and permissions of the medical system
                    </p>
                </div>

                <div className="flex gap-2">
                    <Dialog open={showNewRole} onOpenChange={setShowNewRole}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Shield className="w-4 h-4 mr-2" />
                                New Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Role</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="role-name">Role Name</Label>
                                        <Input
                                            id="role-name"
                                            value={newRole.name}
                                            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                            placeholder="e.g.: Specialist"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role-color">Color</Label>
                                        <Input
                                            id="role-color"
                                            type="color"
                                            value={newRole.color}
                                            onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="role-description">Description</Label>
                                    <Input
                                        id="role-description"
                                        value={newRole.description}
                                        onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                        placeholder="Role description..."
                                    />
                                </div>

                                <div>
                                    <Label>Permissions</Label>
                                    <div className="mt-2 space-y-4 max-h-60 overflow-y-auto">
                                        {modules.map(module => (
                                            <div key={module} className="border rounded-lg p-3">
                                                <h4 className="font-medium mb-2">{module}</h4>
                                                <div className="space-y-2">
                                                    {permissions.filter(p => p.module === module).map(permission => (
                                                        <div key={permission.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`perm-${permission.id}`}
                                                                checked={newRole.permissions.includes(permission.id)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setNewRole({ ...newRole, permissions: [...newRole.permissions, permission.id] });
                                                                    } else {
                                                                        setNewRole({ ...newRole, permissions: newRole.permissions.filter(p => p !== permission.id) });
                                                                    }
                                                                }}
                                                            />
                                                            <Label htmlFor={`perm-${permission.id}`} className="text-sm">
                                                                {permission.name}
                                                                <Badge variant="outline" className="ml-2 text-xs">
                                                                    {permission.level}
                                                                </Badge>
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" onClick={() => { setShowNewRole(false); resetRoleForm(); }}>
                                    Cancel
                                </Button>
                                <Button onClick={createRole} disabled={!newRole.name}>
                                    Create Role
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showNewUser} onOpenChange={setShowNewUser}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                New User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="personal">Personal Data</TabsTrigger>
                                    <TabsTrigger value="professional">Professional Data</TabsTrigger>
                                    <TabsTrigger value="perms">Permissions</TabsTrigger>
                                </TabsList>

                                <TabsContent value="personal" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="first-name">First Name *</Label>
                                            <Input
                                                id="first-name"
                                                value={newUser.firstName}
                                                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="last-name">Last Name *</Label>
                                            <Input
                                                id="last-name"
                                                value={newUser.lastName}
                                                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            placeholder="email@clinic.com"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={newUser.phone}
                                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="professional" className="space-y-4">
                                    <div>
                                        <Label htmlFor="role">Role *</Label>
                                        <Select
                                            value={newUser.role}
                                            onValueChange={(value: User['role']) => {
                                                setNewUser({
                                                    ...newUser,
                                                    role: value,
                                                    permissions: getRolePermissions(value)
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.filter(r => r.active).map(role => (
                                                    <SelectItem key={role.id} value={role.name}>
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: role.color }}
                                                            />
                                                            {role.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {(newUser.role === 'Doctor') && (
                                        <>
                                            <div>
                                                <Label htmlFor="specialty">Specialty</Label>
                                                <Input
                                                    id="specialty"
                                                    value={newUser.specialty || ''}
                                                    onChange={(e) => setNewUser({ ...newUser, specialty: e.target.value })}
                                                    placeholder="e.g.: Cardiology"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="license">Medical License</Label>
                                                <Input
                                                    id="license"
                                                    value={newUser.medicalLicense || ''}
                                                    onChange={(e) => setNewUser({ ...newUser, medicalLicense: e.target.value })}
                                                    placeholder="e.g.: LIC-12345"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={newUser.status}
                                            onValueChange={(value: User['status']) =>
                                                setNewUser({ ...newUser, status: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                                <SelectItem value="Suspended">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent>

                                <TabsContent value="perms" className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Two-Factor Authentication (2FA)</Label>
                                        <Switch
                                            checked={newUser.twoFactorAuth}
                                            onCheckedChange={(checked) =>
                                                setNewUser({ ...newUser, twoFactorAuth: checked })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label>Assigned Permissions</Label>
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                                            {newUser.permissions.length === 0 ? (
                                                <p className="text-sm text-gray-500">No permissions assigned</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {newUser.permissions.map(permId => {
                                                        const permission = permissions.find(p => p.id === permId);
                                                        return permission ? (
                                                            <div key={permId} className="flex items-center justify-between text-sm">
                                                                <span>{permission.name}</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {permission.module}
                                                                </Badge>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" onClick={() => { setShowNewUser(false); resetUserForm(); }}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={createUser}
                                    disabled={!newUser.firstName || !newUser.lastName || !newUser.email}
                                >
                                    Create User
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total Users</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Active Users</p>
                                <p className="text-2xl font-bold">
                                    {users.filter(u => u.status === 'Active').length}
                                </p>
                            </div>
                            <UserCheck className="w-8 h-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Active Sessions</p>
                                <p className="text-2xl font-bold">{activeSessions.length}</p>
                            </div>
                            <Shield className="w-8 h-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100">Defined Roles</p>
                                <p className="text-2xl font-bold">{roles.length}</p>
                            </div>
                            <Key className="w-8 h-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="perms">Permissions</TabsTrigger>
                    <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search by name, last name or email..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All</SelectItem>
                                            {roles.map(role => (
                                                <SelectItem key={role.id} value={role.name}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All</SelectItem>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User List */}
                    <div className="space-y-4">
                        {filteredUsers.map(user => (
                            <Card key={user.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    style={{
                                                        borderColor: getRoleColor(user.role),
                                                        color: getRoleColor(user.role)
                                                    }}
                                                >
                                                    {user.role}
                                                </Badge>
                                                <Badge variant={
                                                    user.status === 'Active' ? 'default' :
                                                        user.status === 'Inactive' ? 'secondary' : 'destructive'
                                                }>
                                                    {user.status}
                                                </Badge>
                                                {user.twoFactorAuth && (
                                                    <Badge variant="outline" className="text-green-600 border-green-300">
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        2FA
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                                <div>
                                                    <strong>Email:</strong> {user.email}
                                                </div>
                                                <div>
                                                    <strong>Phone:</strong> {user.phone}
                                                </div>
                                                <div>
                                                    <strong>Last access:</strong> {
                                                        user.lastAccess === 'Never' ?
                                                            'Never' :
                                                            new Date(user.lastAccess).toLocaleString()
                                                    }
                                                </div>
                                            </div>

                                            {user.specialty && (
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <strong>Specialty:</strong> {user.specialty}
                                                    {user.medicalLicense && ` | License: ${user.medicalLicense}`}
                                                </div>
                                            )}

                                            <div className="text-sm text-gray-600">
                                                <strong>Permissions:</strong> {user.permissions.length} assigned
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => resetPassword(user.id)}
                                            >
                                                <Key className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => changeUserStatus(
                                                    user.id,
                                                    user.status === 'Active' ? 'Suspended' : 'Active'
                                                )}
                                            >
                                                {user.status === 'Active' ?
                                                    <Lock className="w-4 h-4" /> :
                                                    <Unlock className="w-4 h-4" />
                                                }
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => deleteUser(user.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roles.map(role => (
                            <Card key={role.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: role.color }}
                                            />
                                            <h3 className="font-semibold text-lg">{role.name}</h3>
                                        </div>
                                        <Badge variant={role.active ? 'default' : 'secondary'}>
                                            {role.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">{role.description}</p>

                                    <div className="text-sm">
                                        <strong>Permissions:</strong> {role.permissions.length}
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {modules.map(module => {
                                                const modulePermissions = permissions.filter(p =>
                                                    p.module === module && role.permissions.includes(p.id)
                                                ).length;

                                                return modulePermissions > 0 ? (
                                                    <Badge key={module} variant="outline" className="text-xs">
                                                        {module} ({modulePermissions})
                                                    </Badge>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedRole(role)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="perms" className="space-y-4">
                    {modules.map(module => (
                        <Card key={module}>
                            <CardHeader>
                                <CardTitle className="text-lg">{module}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {permissions.filter(p => p.module === module).map(permission => (
                                        <div key={permission.id} className="p-3 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{permission.name}</h4>
                                                <Badge variant={
                                                    permission.level === 'Read' ? 'secondary' :
                                                        permission.level === 'Write' ? 'default' : 'destructive'
                                                }>
                                                    {permission.level}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{permission.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="sessions" className="space-y-4">
                    <div className="space-y-4">
                        {activeSessions.map(session => (
                            <Card key={session.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-2">{session.userName}</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <strong>Device:</strong> {session.device}
                                                </div>
                                                <div>
                                                    <strong>Browser:</strong> {session.browser}
                                                </div>
                                                <div>
                                                    <strong>IP:</strong> {session.ip}
                                                </div>
                                                <div>
                                                    <strong>Location:</strong> {session.location}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                                                <div>
                                                    <strong>Start:</strong> {new Date(session.startTime).toLocaleString()}
                                                </div>
                                                <div>
                                                    <strong>Last activity:</strong> {new Date(session.lastActivity).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => terminateSession(session.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Lock className="w-4 h-4" />
                                                Terminate Session
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* User Detailed View Modal */}
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedUser && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Users className="w-6 h-6 text-blue-600" />
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold">Personal Information</h4>
                                        <div><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</div>
                                        <div><strong>Email:</strong> {selectedUser.email}</div>
                                        <div><strong>Phone:</strong> {selectedUser.phone}</div>
                                        <div><strong>Status:</strong>
                                            <Badge className="ml-2" variant={
                                                selectedUser.status === 'Active' ? 'default' :
                                                    selectedUser.status === 'Inactive' ? 'secondary' : 'destructive'
                                            }>
                                                {selectedUser.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold">Professional Information</h4>
                                        <div><strong>Role:</strong>
                                            <Badge
                                                className="ml-2"
                                                variant="outline"
                                                style={{
                                                    borderColor: getRoleColor(selectedUser.role),
                                                    color: getRoleColor(selectedUser.role)
                                                }}
                                            >
                                                {selectedUser.role}
                                            </Badge>
                                        </div>
                                        {selectedUser.specialty && (
                                            <div><strong>Specialty:</strong> {selectedUser.specialty}</div>
                                        )}
                                        {selectedUser.medicalLicense && (
                                            <div><strong>License:</strong> {selectedUser.medicalLicense}</div>
                                        )}
                                        <div><strong>2FA:</strong> {selectedUser.twoFactorAuth ? 'Enabled' : 'Disabled'}</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Assigned Permissions</h4>
                                    <div className="space-y-3">
                                        {modules.map(module => {
                                            const modulePermissions = permissions.filter(p =>
                                                p.module === module && selectedUser.permissions.includes(p.id)
                                            );

                                            return modulePermissions.length > 0 ? (
                                                <div key={module} className="border rounded-lg p-3">
                                                    <h5 className="font-medium mb-2">{module}</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {modulePermissions.map(permission => (
                                                            <Badge key={permission.id} variant="outline" className="text-xs">
                                                                {permission.name}
                                                                <span className="ml-1 text-gray-500">({permission.level})</span>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-2">Dates</h4>
                                        <div className="space-y-1 text-sm">
                                            <div><strong>Created:</strong> {new Date(selectedUser.creationDate).toLocaleDateString()}</div>
                                            <div><strong>Last access:</strong> {
                                                selectedUser.lastAccess === 'Never' ?
                                                    'Never' :
                                                    new Date(selectedUser.lastAccess).toLocaleString()
                                            }</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Role Detailed View Modal */}
            <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedRole && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                    Role: {selectedRole.name}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-2">General Information</h4>
                                    <div className="space-y-2">
                                        <div><strong>Name:</strong> {selectedRole.name}</div>
                                        <div><strong>Description:</strong> {selectedRole.description}</div>
                                        <div><strong>Status:</strong>
                                            <Badge className="ml-2" variant={selectedRole.active ? 'default' : 'secondary'}>
                                                {selectedRole.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <strong>Color:</strong>
                                            <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: selectedRole.color }}
                                            />
                                            <span className="text-sm text-gray-600">{selectedRole.color}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Assigned Permissions ({selectedRole.permissions.length})</h4>
                                    <div className="space-y-3">
                                        {modules.map(module => {
                                            const modulePermissions = permissions.filter(p =>
                                                p.module === module && selectedRole.permissions.includes(p.id)
                                            );

                                            return modulePermissions.length > 0 ? (
                                                <div key={module} className="border rounded-lg p-3">
                                                    <h5 className="font-medium mb-2">{module}</h5>
                                                    <div className="space-y-1">
                                                        {modulePermissions.map(permission => (
                                                            <div key={permission.id} className="flex items-center justify-between text-sm">
                                                                <span>{permission.name}</span>
                                                                <Badge variant={
                                                                    permission.level === 'Read' ? 'secondary' :
                                                                        permission.level === 'Write' ? 'default' : 'destructive'
                                                                } className="text-xs">
                                                                    {permission.level}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Users with this Role</h4>
                                    <div className="space-y-2">
                                        {users.filter(u => u.role === selectedRole.name).map(user => (
                                            <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-sm">{user.firstName} {user.lastName}</span>
                                                <Badge variant={
                                                    user.status === 'Active' ? 'default' :
                                                        user.status === 'Inactive' ? 'secondary' : 'destructive'
                                                } className="text-xs">
                                                    {user.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagementSystem;
