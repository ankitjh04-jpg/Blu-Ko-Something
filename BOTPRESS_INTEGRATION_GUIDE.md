# Botpress Resume Integration Guide

## Overview

This guide explains how the Botpress chatbot integrates with the resume generation system.

## Data Flow Architecture

```
Botpress Chatbot → Resume Data Service → Supabase Database → My Resumes Tab
```

## Components

### 1. Resume Data Service (`src/services/resumeDataService.ts`)

The central service that manages resume data collection and storage.

**Key Functions:**

- `saveResumeData(data)` - Saves resume data to localStorage
- `getResumeData()` - Retrieves resume data from localStorage
- `isResumeReady()` - Checks if resume data is available
- `clearResumeData()` - Clears stored resume data
- `saveResumeToDatabase(userId, title)` - Saves resume to Supabase via Edge Function
- `parseBotpressData(rawData)` - Parses and structures data from Botpress
- `validateResumeData(data)` - Validates resume data completeness

### 2. ChatbotPage Integration (`src/pages/ChatbotPage.tsx`)

**Features:**

- Listens for Botpress events via `window.botpress.on("message")`
- Displays "Resume Data Ready" banner when data is collected
- Provides "Save Resume" button to save collected data
- Shows notifications for success/error states
- Auto-redirects to My Resumes after successful save

**Event Handling:**

The chatbot listens for a special message type from Botpress:

```javascript
window.botpress?.on("message", (data) => {
  if (data?.payload?.type === "resume_complete") {
    // Process and save resume data
  }
});
```

### 3. ResumePage Updates (`src/pages/ResumePage.tsx`)

**Features:**

- Checks for chatbot data before generating resume
- Prioritizes chatbot data over manual profile data
- Shows modal prompt if no data exists
- Directs users to either AI Assistant or manual profile completion

### 4. Botpress Webhook (`supabase/functions/botpress-webhook/index.ts`)

**Purpose:** Receives resume data and saves it to the database

**Endpoint:** `POST /functions/v1/botpress-webhook`

**Payload Structure:**

```json
{
  "userId": "string",
  "title": "string",
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string"
  },
  "workExperience": [
    {
      "jobTitle": "string",
      "companyName": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "isCurrent": "boolean",
      "description": "string"
    }
  ],
  "skills": ["string"],
  "education": [
    {
      "institutionName": "string",
      "degreeOrProgram": "string",
      "fieldOfStudy": "string",
      "startDate": "string",
      "endDate": "string",
      "isCurrent": "boolean"
    }
  ],
  "status": "complete"
}
```

## Botpress Configuration

To make the chatbot send resume data to the application:

### Option 1: Using Execute Code Card

Add this code in your Botpress flow when the resume is complete:

```javascript
// Collect all the data from workflow variables
const resumeData = {
  personalInfo: {
    name: workflow.fullName,
    email: workflow.email,
    phone: workflow.phone,
    location: workflow.location
  },
  workExperience: workflow.workExperience || [],
  skills: workflow.skills || [],
  education: workflow.education || [],
  certifications: workflow.certifications || []
};

// Send to webchat
workflow.resumeComplete = true;
workflow.finalResumeData = resumeData;

// This will be picked up by the event listener
return {
  type: "resume_complete",
  data: resumeData
};
```

### Option 2: Using Webchat API Card

Configure the Webchat API card to send a custom event:

```json
{
  "type": "resume_complete",
  "payload": {
    "data": "{{workflow.finalResumeData}}"
  }
}
```

### Option 3: Manual Testing

For testing purposes, you can manually trigger the save from browser console:

```javascript
// Simulate chatbot data
window.handleBotpressResumeData({
  personalInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-0123",
    location: "New York, NY"
  },
  workExperience: [
    {
      jobTitle: "Electrician",
      companyName: "ABC Electric",
      location: "New York, NY",
      startDate: "2020-01-01",
      endDate: "2024-01-01",
      isCurrent: false,
      description: "Installed and maintained electrical systems"
    }
  ],
  skills: ["Electrical wiring", "Blueprint reading", "Safety protocols"],
  education: [
    {
      institutionName: "Trade School",
      degreeOrProgram: "Electrical Certificate",
      fieldOfStudy: "Electrical",
      startDate: "2018-01-01",
      endDate: "2020-01-01",
      isCurrent: false
    }
  ],
  certifications: ["Journeyman License", "OSHA Certified"]
});
```

## User Flow

### Scenario 1: Using Chatbot (Recommended)

1. User navigates to **AI Assistant** page
2. User completes conversation with Botpress chatbot
3. Chatbot sends `resume_complete` event with data
4. System saves data to localStorage
5. **"Resume Data Ready"** banner appears
6. User clicks **"Save Resume"** button
7. System validates data
8. System calls Edge Function to save to database
9. Success notification appears
10. User is redirected to **My Resumes** tab
11. New resume appears in the list

### Scenario 2: Generate New Resume (with chatbot data)

1. User navigates to **My Resumes** page
2. User clicks **"Generate New Resume"**
3. System checks for chatbot data
4. If found, uses chatbot data to create resume
5. Resume appears in list immediately

### Scenario 3: Generate New Resume (without data)

1. User navigates to **My Resumes** page
2. User clicks **"Generate New Resume"**
3. System checks for chatbot data (none found)
4. System checks profile completion
5. Modal appears: "Profile Incomplete"
6. User can choose:
   - **"Use AI Assistant"** → Redirects to chatbot
   - **"Complete Profile Manually"** → Redirects to profile page

## Data Storage

### LocalStorage Keys

- `resumeData` - Stores the resume data object
- `resumeReady` - Boolean flag indicating data is ready

### Database Storage

Resumes are stored in the `resumes` table with:

- `id` - Unique identifier
- `user_id` - User reference
- `title` / `resume_name` - Resume title
- `template_name` - Template used (default: "botpress")
- `resume_data` - Full resume data JSON
- `personal_info` - Personal information object
- `work_experience` - Array of work experiences
- `skills` - Array of skills
- `education` - Array of education entries
- `status` - Resume status (default: "complete")
- `file_size` - Calculated file size
- `share_token` - Unique token for sharing
- `created_at` / `updated_at` - Timestamps

## Error Handling

The system includes comprehensive error handling:

1. **Network Errors** - Displayed to user with retry option
2. **Validation Errors** - Shows specific missing fields
3. **Authentication Errors** - Prompts user to log in
4. **Database Errors** - Gracefully handled with user notification

## Testing Checklist

- [ ] Chatbot conversation completes successfully
- [ ] Resume data is saved to localStorage
- [ ] "Resume Data Ready" banner appears
- [ ] Save Resume button works
- [ ] Data is validated correctly
- [ ] Resume appears in My Resumes tab
- [ ] Resume can be viewed
- [ ] Resume can be downloaded (HTML/PDF)
- [ ] Resume can be shared
- [ ] Resume can be deleted
- [ ] Error states display correctly
- [ ] Generate New Resume uses chatbot data
- [ ] Modal prompt appears when no data exists

## Color Scheme

All components use the existing color palette:

- **Primary Background**: `#002B5C`, `#003A6E`, `#1E4C80`
- **Accent**: `#FBC888` (buttons, highlights)
- **Text**: `#FFFFFF` (primary), `#A8B8CC` (secondary)
- **Borders**: `#6A7B93`

## Future Enhancements

1. Real-time sync between chatbot and resume preview
2. Ability to edit resume data before saving
3. Multiple resume templates
4. Resume version history
5. AI-powered resume suggestions
6. Export to more formats (DOCX, RTF)
