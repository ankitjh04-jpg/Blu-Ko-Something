# AI Resume Builder with Botpress Integration

A modern web application that helps users create professional resumes through an AI-powered chatbot interface. Built with React, Supabase, and Botpress for seamless resume generation and management.

## Features

### Core Functionality
- **AI-Powered Resume Creation**: Chat with a Botpress chatbot to create resumes conversationally
- **Resume Management**: View, edit, download, share, and delete your resumes
- **Multiple Export Formats**: Download resumes in HTML or PDF format
- **Public Sharing**: Generate shareable links for your resumes
- **User Authentication**: Secure email/password authentication via Supabase
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Resume Features
- Personal information (name, email, phone, location)
- Work experience with detailed job descriptions
- Skills listing
- Education history
- Professional certifications
- Multiple languages

### User Experience
- Real-time resume preview
- Drag-and-drop friendly interface
- Toast notifications for user feedback
- Loading states and error handling
- Empty states with helpful guidance

## Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Edge Functions (serverless)
- **Supabase Edge Functions** - Webhook endpoints for Botpress

### PDF Generation
- **jsPDF** - PDF generation library
- **html2canvas** - HTML to canvas rendering for PDF conversion

### Chatbot
- **Botpress** - Conversational AI platform

## Installation

### Prerequisites
- Node.js 18+ and npm
- A Supabase account
- A Botpress account (for chatbot integration)

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**

The `.env` file is already configured with Supabase credentials. No additional setup needed for local development.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database Setup**

The database migrations are already applied. The following tables are available:
- `user_profiles` - User profile information
- `work_experiences` - Work history
- `skills` - User skills
- `certifications` - Professional certifications
- `education` - Educational background
- `languages` - Languages spoken
- `resumes` - Generated resumes
- `resume_shares` - Resume sharing tracking
- `chatbot_conversations` - Chat history

5. **Run the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Botpress Integration

### Webhook Setup

The application provides two Edge Functions for Botpress integration:

#### 1. Main Webhook Endpoint
**URL**: `https://xsnqbxcthhtqczbkyyfw.supabase.co/functions/v1/botpress-webhook`

This endpoint receives resume data from Botpress and stores it in the database.

**Request Format**:
```json
{
  "userId": "uuid",
  "title": "Resume Title",
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, NY"
  },
  "workExperience": [
    {
      "jobTitle": "Software Engineer",
      "companyName": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "isCurrent": false,
      "description": "Developed web applications..."
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"],
  "education": [
    {
      "institutionName": "University Name",
      "degreeOrProgram": "Bachelor of Science",
      "fieldOfStudy": "Computer Science",
      "startDate": "2016-09-01",
      "endDate": "2020-05-31",
      "isCurrent": false
    }
  ],
  "status": "complete"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Resume saved successfully",
  "resumeId": "uuid",
  "shareToken": "unique-token"
}
```

#### 2. Test Endpoint
**URL**: `https://xsnqbxcthhtqczbkyyfw.supabase.co/functions/v1/botpress-test`

Use this endpoint to verify your Botpress connection is working.

**Response**:
```json
{
  "success": true,
  "message": "Botpress webhook connection is working!",
  "timestamp": "2025-10-21T12:00:00.000Z",
  "endpoint": "botpress-webhook"
}
```

### Configuring Botpress

1. **Create a Botpress Bot**
   - Log in to your Botpress account
   - Create a new bot or use an existing one

2. **Add Webhook Integration**
   - In your bot's settings, add a webhook integration
   - Set the webhook URL to: `https://xsnqbxcthhtqczbkyyfw.supabase.co/functions/v1/botpress-webhook`
   - The webhook does not require authentication (verify_jwt is set to false)

3. **Configure Bot Flow**
   - Design your conversation flow to collect:
     - Personal information
     - Work experience
     - Skills
     - Education
   - Format the collected data according to the request format above
   - Send the formatted data to the webhook endpoint

4. **Test the Integration**
   - Use the test endpoint to verify connectivity
   - Send a test payload to the main webhook
   - Check the database to confirm data was saved

### Security Notes
- The webhook endpoints use CORS headers to allow cross-origin requests
- Authentication is handled at the application level (user_id in payload)
- Edge Functions have access to Supabase service role key for database operations

## Usage

### For End Users

1. **Sign Up / Sign In**
   - Create an account using email and password
   - No email confirmation required

2. **Create Your Profile**
   - Fill in your personal information
   - Add work experience, skills, education, etc.

3. **Generate Resume**
   - Use the "My Resumes" page to generate a resume from your profile
   - Or use the AI chatbot to create a resume conversationally

4. **Manage Resumes**
   - **View**: Preview your resume in a modal
   - **Download**: Export as HTML or PDF
   - **Share**: Generate a public link to share your resume
   - **Delete**: Remove resumes you no longer need

5. **Share Your Resume**
   - Click the "Share" button on any resume
   - The share link is automatically copied to your clipboard
   - Share the link with employers or colleagues
   - Public resumes can be viewed without authentication

### For Developers

#### Project Structure
```
project/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── resume/         # Resume-related components
│   │   └── shared/         # Shared components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Libraries and utilities
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   └── main.tsx           # Application entry point
├── supabase/
│   ├── functions/          # Edge Functions
│   └── migrations/         # Database migrations
└── public/                # Static assets
```

#### Key Components

**ResumeCard** (`src/components/resume/ResumeCard.tsx`)
- Displays resume summary in card format
- Provides action buttons (view, download, share, delete)

**ResumePreview** (`src/components/resume/ResumePreview.tsx`)
- Shows full resume in modal or page view
- Formats personal info, work experience, skills, education

**ResumePage** (`src/pages/ResumePage.tsx`)
- Main resume management interface
- Handles resume CRUD operations
- Integrates with download and share functionality

**SharedResumePage** (`src/pages/SharedResumePage.tsx`)
- Public-facing resume view
- No authentication required
- Supports download functionality

#### Database Schema

**resumes table**:
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (text)
- resume_name (text)
- personal_info (jsonb)
- work_experience (jsonb)
- skills (jsonb)
- education (jsonb)
- status (text)
- file_size (text)
- share_token (text, unique)
- is_public (boolean)
- template_name (text)
- resume_data (jsonb)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### API Endpoints

All Edge Functions are available at:
`https://xsnqbxcthhtqczbkyyfw.supabase.co/functions/v1/`

- `POST /botpress-webhook` - Receive resume data from Botpress
- `GET /botpress-test` - Test Botpress connectivity

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run TypeScript type checking
npm run typecheck

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Adding New Features

1. Create components in appropriate directories
2. Update TypeScript interfaces for type safety
3. Add new routes in `App.tsx` if needed
4. Create database migrations for schema changes
5. Update RLS policies for security

### Database Migrations

To create a new migration:
1. Use the Supabase CLI or dashboard
2. Follow the naming convention: `YYYYMMDDHHMMSS_description.sql`
3. Include comprehensive comments explaining changes
4. Always enable RLS and create appropriate policies

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

3. **Deploy to Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables for Production

Set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Supabase Configuration

The Supabase project is already configured with:
- Database tables and RLS policies
- Edge Functions deployed
- Authentication enabled

No additional Supabase configuration is needed.

## Troubleshooting

### Common Issues

**Issue**: Resume not loading
- Check user authentication
- Verify RLS policies allow access
- Check browser console for errors

**Issue**: Botpress webhook failing
- Verify webhook URL is correct
- Check payload format matches expected structure
- Test with the `/botpress-test` endpoint first

**Issue**: PDF download not working
- Ensure html2canvas and jsPDF are installed
- Check if resume preview element exists in DOM
- Verify browser allows file downloads

**Issue**: Share link not working
- Confirm resume `is_public` is set to true
- Verify share token is included in URL
- Check RLS policies allow anonymous access for public resumes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Built with React and TypeScript
- Powered by Supabase
- AI chatbot by Botpress
- Icons by Lucide React
- PDF generation by jsPDF and html2canvas

## Support

For issues or questions:
- Check the troubleshooting section
- Review Supabase documentation
- Check Botpress documentation
- Open an issue on GitHub

---

Made with care for job seekers everywhere.
