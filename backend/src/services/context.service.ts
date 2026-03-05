import { prisma } from '../prisma/client.js';

export async function getPortfolioContext(): Promise<string> {
  const profile = await prisma.profile.findFirst();
  const experience = await prisma.experience.findMany();
  const skills = await prisma.skill.findMany();
  const education = await prisma.education.findMany();
  const certifications = await prisma.certification.findMany();
  const projects = await prisma.project.findMany();
  const trivia = await prisma.trivia.findMany();

  if (!profile) {
    return 'No profile data available.';
  }

  const context = `
NAME: ${profile.name}
TITLE: ${profile.title}
SUMMARY: ${profile.summary}
CONTACT: Email: ${profile.email} | Phone: ${profile.phone} | LinkedIn: ${profile.linkedin}
LOCATION: ${profile.location}
ENGLISH LEVEL: ${profile.english}

WORK EXPERIENCE:
${experience.map(e => `- ${e.role} at ${e.company} (${e.startDate} – ${e.endDate}, ${e.location})
  ${e.description.map(d => `  • ${d}`).join('\n')}`).join('\n\n')}

SKILLS:
${skills.map(s => `- ${s.category}: ${s.items.join(', ')}`).join('\n')}

EDUCATION:
${education.map(e => `- ${e.degree} — ${e.school} (${e.period})`).join('\n')}

CERTIFICATIONS:
${certifications.map(c => `- ${c.name} by ${c.issuer} (${c.year})`).join('\n')}

PROJECTS:
${projects.map(p => `- ${p.name}: ${p.description}
  Technologies: ${p.technologies.join(', ')}
  Highlights: ${p.highlights.join(', ')}`).join('\n\n')}

TRIVIA & CURIOSITIES:
${trivia.map(t => `- ${t.category}: ${t.content}`).join('\n')}
  `.trim();

  return context;
}
