import React, { useState } from 'react';
import { Plus, Trash2, LogIn, Award, GraduationCap, Briefcase, Code, FolderGit2, RefreshCw, LayoutDashboard } from 'lucide-react';

export const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminKey, setAdminKey] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminToken, setAdminToken] = useState('');
    const [loginError, setLoginError] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'experience' | 'skills' | 'projects' | 'education' | 'certifications'>('experience');

    const authHeaders = (extra?: Record<string, string>) => ({
        ...extra,
        'x-admin-token': adminToken,
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/data');
            const d = await res.json();
            setData(d);
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: adminEmail, password: adminKey })
            });
            if (res.ok) {
                const token = btoa(`${adminEmail}:${adminKey}`);
                setAdminToken(token);
                setIsAuthenticated(true);
                // fetchData will run after state update below
            } else {
                setLoginError('Credenciales inválidas');
            }
        } catch (error) {
            setLoginError('Error de conexión');
        }
    };

    // Trigger fetchData after authentication
    React.useEffect(() => {
        if (isAuthenticated && adminToken) fetchData();
    }, [isAuthenticated, adminToken]);

    const handleDelete = async (type: string, id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;
        try {
            const res = await fetch(`/api/admin/${type}/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (res.ok) fetchData();
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    const handleAddExperience = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newExp = {
            company: formData.get('company'),
            role: formData.get('role'),
            location: formData.get('location'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            description: (formData.get('description') as string).split('\n').filter(l => l.trim()),
        };

        try {
            const res = await fetch('/api/admin/experience', {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(newExp)
            });
            if (res.ok) { fetchData(); e.currentTarget.reset(); }
        } catch (error) {
            alert('Error al añadir');
        }
    };

    const handleAddSkill = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newSkill = {
            category: formData.get('category'),
            items: (formData.get('items') as string).split(',').map(i => i.trim()),
        };
        const res = await fetch('/api/admin/skill', {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(newSkill)
        });
        if (res.ok) { fetchData(); e.currentTarget.reset(); }
    };

    const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newProject = {
            name: formData.get('name'),
            description: formData.get('description'),
            technologies: (formData.get('technologies') as string).split(',').map(i => i.trim()),
            highlights: (formData.get('highlights') as string).split('\n').filter(l => l.trim()),
        };

        try {
            const res = await fetch('/api/admin/project', {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(newProject)
            });
            if (res.ok) { fetchData(); e.currentTarget.reset(); }
        } catch (error) {
            alert('Error al añadir proyecto');
        }
    };

    const handleAddEducation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newEdu = {
            degree: formData.get('degree'),
            school: formData.get('school'),
            period: formData.get('period'),
        };
        const res = await fetch('/api/admin/education', {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(newEdu)
        });
        if (res.ok) { fetchData(); e.currentTarget.reset(); }
    };

    const handleAddCertification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCert = {
            name: formData.get('name'),
            issuer: formData.get('issuer'),
            year: formData.get('year'),
        };
        const res = await fetch('/api/admin/certification', {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(newCert)
        });
        if (res.ok) { fetchData(); e.currentTarget.reset(); }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white p-4">
                <div className="glass p-8 rounded-2xl w-full max-w-md border border-white/10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                            <LogIn size={32} className="text-blue-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-center">Portfolio Admin</h2>
                    <p className="text-gray-400 text-sm text-center mb-8">Acceso restringido</p>
                    {loginError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4 text-center">
                            {loginError}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-mono">Correo</label>
                            <input
                                type="text"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-mono">Contraseña</label>
                            <input
                                type="password"
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                            Iniciar sesión
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const navigation = [
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'projects', label: 'Projects', icon: FolderGit2 },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'certifications', label: 'Certifications', icon: Award },
    ];

    return (
        <div className="min-h-screen bg-[#06060a] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-[#0a0a0f] flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20">N</div>
                    <h1 className="font-bold tracking-tight text-sm">NEAR DASHBOARD</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeSection === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <button onClick={fetchData} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 transition-all">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh Data
                    </button>
                    <a href="/" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border border-white/10 hover:bg-white/5 transition-all">
                        View Site
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight capitalize">{activeSection}</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage your professional {activeSection} data</p>
                        </div>
                    </div>

                    {/* Dynamic Section Forms */}
                    <div className="space-y-8">
                        {/* Experience Form */}
                        {activeSection === 'experience' && (
                            <section className="animate-fade-in">
                                <form onSubmit={handleAddExperience} className="glass p-6 rounded-2xl border border-white/10 space-y-4 mb-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Role</label>
                                            <input name="role" placeholder="e.g. Full Stack Developer" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500/50" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Company</label>
                                            <input name="company" placeholder="e.g. Google" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500/50" required />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Location</label>
                                        <input name="location" placeholder="e.g. Remote / New York" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500/50" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Start Date</label>
                                            <input name="startDate" placeholder="Jan 2023" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500/50" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">End Date</label>
                                            <input name="endDate" placeholder="Present" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500/50" required />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Description (one per line)</label>
                                        <textarea name="description" placeholder="Developed API...&#10;Mentored team..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500/50 h-32" required />
                                    </div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition-all">Add Experience</button>
                                </form>

                                <div className="space-y-3">
                                    {data?.experiences?.map((exp: any) => (
                                        <div key={exp.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                            <div>
                                                <p className="font-semibold">{exp.role}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-tight">{exp.company} • {exp.startDate}-{exp.endDate}</p>
                                            </div>
                                            <button onClick={() => handleDelete('experience', exp.id)} className="text-gray-500 hover:text-red-400 p-2 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills Section */}
                        {activeSection === 'skills' && (
                            <section className="animate-fade-in">
                                <form onSubmit={handleAddSkill} className="glass p-6 rounded-2xl border border-white/10 space-y-4 mb-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Category</label>
                                        <select name="category" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none cursor-pointer">
                                            <option value="Front-End" className="bg-[#0a0a0f]">Front-End</option>
                                            <option value="Back-End" className="bg-[#0a0a0f]">Back-End</option>
                                            <option value="Databases" className="bg-[#0a0a0f]">Databases</option>
                                            <option value="DevOps & Tools" className="bg-[#0a0a0f]">DevOps & Tools</option>
                                            <option value="Cloud" className="bg-[#0a0a0f]">Cloud</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Items (comma separated)</label>
                                        <input name="items" placeholder="React, TypeScript, Tailwind" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-green-500/50" required />
                                    </div>
                                    <button type="submit" className="w-full bg-green-600/20 text-green-400 border border-green-500/30 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all">Add Skills</button>
                                </form>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data?.skills?.map((s: any) => (
                                        <div key={s.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-green-400">{s.category}</p>
                                                <p className="text-xs text-gray-500 mt-1">{s.items.join(', ')}</p>
                                            </div>
                                            <button onClick={() => handleDelete('skill', s.id)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects Section */}
                        {activeSection === 'projects' && (
                            <section className="animate-fade-in">
                                <form onSubmit={handleAddProject} className="glass p-6 rounded-2xl border border-white/10 space-y-4 mb-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Project Name</label>
                                        <input name="name" placeholder="e.g. AI Portfolio" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-500/50" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Description</label>
                                        <textarea name="description" placeholder="Short summary of the project..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-500/50 h-24" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Technologies (comma separated)</label>
                                        <input name="technologies" placeholder="Node.js, Express, Prisma" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-500/50" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Highlights (one per line)</label>
                                        <textarea name="highlights" placeholder="Performance boosted by 40%...&#10;Integrated real-time chat..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-500/50 h-24" required />
                                    </div>
                                    <button type="submit" className="w-full bg-purple-600/20 text-purple-400 border border-purple-500/30 py-3 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all">Add Project</button>
                                </form>
                                <div className="space-y-4">
                                    {data?.projects?.map((p: any) => (
                                        <div key={p.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-start group">
                                            <div className="space-y-1">
                                                <p className="font-bold text-lg">{p.name}</p>
                                                <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {p.technologies.slice(0, 3).map((tech: string, i: number) => (
                                                        <span key={i} className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">{tech}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete('project', p.id)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education Section */}
                        {activeSection === 'education' && (
                            <section className="animate-fade-in">
                                <form onSubmit={handleAddEducation} className="glass p-6 rounded-2xl border border-white/10 space-y-4 mb-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Degree</label>
                                        <input name="degree" placeholder="B.S. in Systems Engineering" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">School</label>
                                        <input name="school" placeholder="University of Technology" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Period</label>
                                        <input name="period" placeholder="2018 - 2022" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" required />
                                    </div>
                                    <button type="submit" className="w-full bg-yellow-600/20 text-yellow-500 border border-yellow-500/30 py-3 rounded-xl font-semibold hover:bg-yellow-600 hover:text-white transition-all">Add Education</button>
                                </form>
                                <div className="space-y-3">
                                    {data?.education?.map((e: any) => (
                                        <div key={e.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group">
                                            <div>
                                                <p className="font-semibold">{e.degree}</p>
                                                <p className="text-xs text-gray-500">{e.school} • {e.period}</p>
                                            </div>
                                            <button onClick={() => handleDelete('education', e.id)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certifications Section */}
                        {activeSection === 'certifications' && (
                            <section className="animate-fade-in">
                                <form onSubmit={handleAddCertification} className="glass p-6 rounded-2xl border border-white/10 space-y-4 mb-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Certification Name</label>
                                        <input name="name" placeholder="AWS Certified Architect" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Issuer</label>
                                            <input name="issuer" placeholder="Amazon Web Services" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Year</label>
                                            <input name="year" placeholder="2023" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" required />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 py-3 rounded-xl font-semibold hover:bg-cyan-600 hover:text-white transition-all">Add Certification</button>
                                </form>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data?.certifications?.map((c: any) => (
                                        <div key={c.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group">
                                            <div>
                                                <p className="font-semibold text-sm">{c.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{c.issuer} • {c.year}</p>
                                            </div>
                                            <button onClick={() => handleDelete('certification', c.id)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
