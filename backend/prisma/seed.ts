import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.trivia.deleteMany();
    await prisma.trivia.deleteMany();
    await prisma.project.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.profile.deleteMany();

    // Profile
    await prisma.profile.create({
        data: {
            name: 'Jafet Duarte',
            title: 'Full Stack Web Developer | Systems Engineer',
            summary: 'Systems Engineer with full stack development experience, capable of building end-to-end web solutions. Proficient in React, TypeScript, JavaScript, NodeJS, and CSS/SCSS on the front end, with solid back-end expertise in RESTful API design, database management (MySQL, NoSQL/MongoDB), and server-side logic. Experienced with Docker, GitHub Actions, CI/CD pipelines, and cloud environments.',
            email: 'jafetduarte01@gmail.com',
            phone: '+506 8719-3590',
            location: 'Bagaces, Guanacaste, Costa Rica',
            linkedin: 'linkedin.com/in/jafetdg',
            english: 'B2 Intermediate-Advanced',
        },
    });

    // Experience
    await prisma.experience.createMany({
        data: [
            {
                company: 'Fundación Universitaria CEIPA',
                role: 'Full Stack Developer – Supervised Internship',
                location: 'Costa Rica - Colombia (Remote)',
                startDate: 'September 2025',
                endDate: 'December 2025',
                description: [
                    'Designed and developed a complete full stack web application to simulate multi-level supply chain logistics replacing manual spreadsheet-based processes.',
                    'Built a dynamic responsive front-end using React and TypeScript with reusable components, SCSS styling, and Bootstrap layout.',
                    'Developed the back-end layer including RESTful API design, business logic, and server-side data processing using NodeJS.',
                    'Managed relational and non-relational databases (MySQL / NoSQL) to store simulation parameters, inventory flows, and historical results.',
                    'Containerized the application using Docker for consistent development and deployment environments.',
                    'Implemented version control workflows on GitHub with structured branching strategies.',
                ],
            },
            {
                company: 'Ponderosa Adventure Park',
                role: 'Tourist Guide & Maintenance Operator',
                location: 'Bagaces, Guanacaste, Costa Rica',
                startDate: 'January 2025',
                endDate: 'June 2025',
                description: [
                    'Delivered clear professional communication in both English and Spanish with international visitors.',
                    'Demonstrated strong interpersonal and cross-cultural communication skills applicable to remote team environments.',
                ],
            },
        ],
    });

    // Education
    await prisma.education.createMany({
        data: [
            {
                degree: "Bachelor's Degree in Computer Systems Engineering",
                school: 'Universidad Latina de Costa Rica',
                period: '2022 – 2025',
            },
            {
                degree: 'Advanced English B2',
                school: 'Instituto Estelar Bilingüe',
                period: '2012 – 2019',
            },
        ],
    });

    // Skills
    await prisma.skill.createMany({
        data: [
            { category: 'Front-End', items: ['JavaScript ES6+', 'TypeScript', 'React', 'GatsbyJS', 'Angular', 'CSS3', 'SCSS', 'Bootstrap', 'WordPress'] },
            { category: 'Back-End', items: ['NodeJS', 'Express', 'RESTful API design', 'Java', 'server-side logic'] },
            { category: 'Databases', items: ['MySQL', 'MongoDB', 'NoSQL', 'Supabase', 'Prisma', 'query optimization', 'data modeling'] },
            { category: 'DevOps & Tools', items: ['Docker', 'GitHub', 'GitHub Actions', 'CI/CD pipelines', 'MS Visual Studio', 'branching strategies'] },
            { category: 'Cloud', items: ['AWS basic', 'Vercel', 'Railway'] },
            { category: 'Other', items: ['Web accessibility', 'SEO/SEM awareness', 'technical documentation', 'Office 365 Advanced', 'Ethical Hacking basics', 'Cybersecurity Awareness'] },
        ],
    });

    // Certifications
    await prisma.certification.createMany({
        data: [
            { name: 'Ethical Hacking', issuer: 'Udemy', year: '2023' },
            { name: 'Cybersecurity Awareness', issuer: 'Certiprof', year: '2024' },
            { name: 'Customer Service', issuer: 'Ponderosa', year: '2025' },
        ],
    });

    // Trivia & Curiosities
    await prisma.trivia.createMany({
        data: [
            {
                category: 'Assistant Name: Near',
                content: `Near es un personaje altamente brillante, analítico y metódico, conocido por su capacidad para resolver problemas complejos con una lógica impecable. En este portafolio, Near asume el rol de asistente estratégico de Jafet, utilizando esa misma agudeza mental para responder con precisión sobre su trayectoria, habilidades y visión técnica. Se guía por la razón y los datos, ofreciendo una experiencia de chat clara y directa.

Conecta con quienes valoran el pensamiento profundo y la resolución de problemas técnicos. Near representa el genio silencioso que triunfa con paciencia y precisión, cualidades que Jafet busca emular en su trabajo como ingeniero. No está aquí para resolver crímenes, sino para ser el puente lógico entre el talento de Jafet y las necesidades de quienes visitan su portafolio.`,
            },
            {
                category: 'Origin of Near',
                content: 'Jafet decidió bautizar a su asistente como Near porque se siente identificado con su enfoque metódico y su capacidad para encontrar claridad en el desarrollo de software a través del análisis detallado.',
            },
            {
                category: 'Personal Interests',
                content: 'A Jafet le apasiona la arquitectura de sistemas escalables, la ciberseguridad y la optimización de procesos complejos mediante el código.',
            },
        ],
    });

    console.log('✅ Database seeded successfully!');
}

seed()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
