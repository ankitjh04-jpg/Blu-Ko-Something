import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface Education {
  institutionName: string;
  degreeOrProgram: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

interface Resume {
  id: string;
  title: string;
  personal_info: PersonalInfo;
  work_experience: WorkExperience[];
  skills: string[];
  education: Education[];
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

export const downloadAsHTML = (resume: Resume) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resume.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            color: #333;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            color: #1a1a1a;
        }
        h2 {
            font-size: 1.5em;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 5px;
        }
        .contact-info {
            margin-bottom: 30px;
            color: #666;
        }
        .contact-info span {
            margin-right: 20px;
        }
        .experience-item, .education-item {
            margin-bottom: 20px;
            padding-left: 15px;
            border-left: 3px solid #2563eb;
        }
        .job-title, .degree {
            font-size: 1.2em;
            font-weight: bold;
            color: #1a1a1a;
        }
        .company, .institution {
            font-weight: 600;
            color: #444;
        }
        .date-range {
            color: #666;
            font-size: 0.9em;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill-tag {
            background-color: #e0f2fe;
            color: #0369a1;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <h1>${resume.personal_info.name}</h1>
    <div class="contact-info">
        ${resume.personal_info.email ? `<span>📧 ${resume.personal_info.email}</span>` : ''}
        ${resume.personal_info.phone ? `<span>📞 ${resume.personal_info.phone}</span>` : ''}
        ${resume.personal_info.location ? `<span>📍 ${resume.personal_info.location}</span>` : ''}
    </div>

    ${resume.work_experience && resume.work_experience.length > 0 ? `
    <h2>Work Experience</h2>
    ${resume.work_experience.map(exp => `
        <div class="experience-item">
            <div class="job-title">${exp.jobTitle}</div>
            <div class="company">${exp.companyName}</div>
            <div class="date-range">
                ${exp.location ? `${exp.location} | ` : ''}
                ${formatDate(exp.startDate)} - ${exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
            </div>
            ${exp.description ? `<p>${exp.description}</p>` : ''}
        </div>
    `).join('')}
    ` : ''}

    ${resume.skills && resume.skills.length > 0 ? `
    <h2>Skills</h2>
    <div class="skills">
        ${resume.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
    </div>
    ` : ''}

    ${resume.education && resume.education.length > 0 ? `
    <h2>Education</h2>
    ${resume.education.map(edu => `
        <div class="education-item">
            <div class="degree">${edu.degreeOrProgram}</div>
            <div class="institution">${edu.institutionName}</div>
            ${edu.fieldOfStudy ? `<div>${edu.fieldOfStudy}</div>` : ''}
            ${(edu.startDate || edu.endDate) ? `
                <div class="date-range">
                    ${formatDate(edu.startDate)} - ${edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                </div>
            ` : ''}
        </div>
    `).join('')}
    ` : ''}
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.title.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAsPDF = async (resume: Resume) => {
  const element = document.getElementById('resume-preview');
  if (!element) {
    throw new Error('Resume preview element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${resume.title.replace(/\s+/g, '_')}.pdf`);
};
