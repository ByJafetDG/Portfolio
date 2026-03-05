import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/ui/navbar';
import { Hero } from './components/Portfolio/Hero';
import { Experience } from './components/Portfolio/Experience';
import { Skills } from './components/Portfolio/Skills';
import { Certifications } from './components/Portfolio/Certifications';
import { Contact } from './components/Portfolio/Contact';
import { Testimonials } from './components/Portfolio/Testimonials';
import { Admin } from './pages/Admin';

const Home = () => (
    <>
        <Navbar />
        <Hero />
        <Experience />
        <Skills />
        <Certifications />
        <Contact />
        <Testimonials />
    </>
);

function App() {
    return (
        <Router>
            <div className="min-h-screen" style={{ background: '#000' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
