# Quick Testing Guide

## How to Test the Botpress Integration

### Method 1: Manual Testing via Browser Console

1. Open your application in the browser
2. Navigate to the **AI Assistant** page
3. Open browser Developer Tools (F12)
4. Go to the **Console** tab
5. Paste and run this code:

```javascript
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
      description: "Installed and maintained electrical systems in residential and commercial buildings"
    }
  ],
  skills: ["Electrical wiring", "Blueprint reading", "Safety protocols", "Troubleshooting"],
  education: [
    {
      institutionName: "NYC Trade School",
      degreeOrProgram: "Electrical Certificate",
      fieldOfStudy: "Electrical Engineering",
      startDate: "2018-01-01",
      endDate: "2020-01-01",
      isCurrent: false
    }
  ],
  certifications: ["Journeyman Electrician License", "OSHA 30 Certified"]
});
```

6. You should see:
   - Success notification: "Resume data collected! Click 'Save Resume' to save it."
   - Yellow banner appears: "Resume Data Ready"
   - "Save Resume" button is visible

7. Click **"Save Resume"** button

8. You should see:
   - "Saving..." text on button
   - Success notification: "Resume saved successfully! Redirecting to My Resumes..."
   - Automatic redirect to My Resumes page after 2 seconds

9. On My Resumes page, verify:
   - New resume card appears
   - Resume title shows current date
   - Can click "View" to see resume preview
   - Can click "Download" to download as HTML or PDF
   - Can click "Share" to generate shareable link

### Method 2: Test "Generate New Resume" Button

#### With Chatbot Data:

1. Run the manual test above (Method 1) to load data
2. Navigate to **My Resumes** page
3. Click **"Generate New Resume"** button
4. Resume should be created automatically from chatbot data
5. Success notification appears
6. New resume appears in list

#### Without Chatbot Data:

1. Clear localStorage:
   ```javascript
   localStorage.removeItem('resumeData');
   localStorage.removeItem('resumeReady');
   ```
2. Navigate to **My Resumes** page
3. Click **"Generate New Resume"** button
4. Modal should appear: "Profile Incomplete"
5. Two options:
   - **"Use AI Assistant"** - redirects to chatbot
   - **"Complete Profile Manually"** - redirects to profile

### Method 3: Check LocalStorage

At any time, check what's stored:

```javascript
// Check if resume data exists
console.log('Resume Ready:', localStorage.getItem('resumeReady'));

// View stored resume data
console.log('Resume Data:', JSON.parse(localStorage.getItem('resumeData')));
```

### Method 4: Configure Botpress to Send Data

In your Botpress flow, add an **Execute Code** card at the end:

```javascript
// After collecting all information in your workflow
const resumeData = {
  personalInfo: {
    name: workflow.fullName || "",
    email: workflow.email || "",
    phone: workflow.phone || "",
    location: workflow.location || ""
  },
  workExperience: workflow.workExperience || [],
  skills: workflow.skills || [],
  education: workflow.education || [],
  certifications: workflow.certifications || []
};

// Send message that will trigger the event
workflow.sendWebchatEvent = {
  type: "resume_complete",
  payload: {
    type: "resume_complete",
    data: resumeData
  }
};
```

## Expected Results Checklist

### On Chatbot Page:
- ✅ Chatbot loads and is functional
- ✅ Yellow banner appears when data is ready
- ✅ "Save Resume" button is visible
- ✅ Clicking button shows "Saving..." state
- ✅ Success notification appears
- ✅ Auto-redirects to My Resumes after 2 seconds

### On My Resumes Page:
- ✅ New resume appears in the list
- ✅ Resume card shows title and date
- ✅ "View" button opens preview modal
- ✅ "Download" button shows format options
- ✅ "Share" button copies link to clipboard
- ✅ "Delete" button removes resume

### Generate New Resume Button:
- ✅ Uses chatbot data if available
- ✅ Shows modal if no data exists
- ✅ Modal offers AI Assistant or manual profile options

## Troubleshooting

### Issue: Banner doesn't appear
**Solution:** Check browser console for errors, verify data was saved:
```javascript
console.log(localStorage.getItem('resumeReady'));
```

### Issue: Save fails
**Solution:** Check network tab in DevTools for Edge Function response:
- URL should be: `https://xsnqbxcthhtqczbkyyfw.supabase.co/functions/v1/botpress-webhook`
- Should see POST request
- Check response for error messages

### Issue: Resume doesn't appear in list
**Solution:**
- Check Supabase database for new entry
- Verify user is logged in
- Try refreshing the page

### Issue: Data validation fails
**Solution:** Ensure all required fields are present:
- personalInfo.name (required)
- personalInfo.email (required)
- At least one workExperience entry
- At least one skill

## Sample Test Data Sets

### Minimal Valid Data:
```javascript
{
  personalInfo: { name: "Test User", email: "test@example.com" },
  workExperience: [{ jobTitle: "Worker", companyName: "Company", startDate: "2020-01-01" }],
  skills: ["Skill 1"],
  education: [],
  certifications: []
}
```

### Complete Data:
```javascript
{
  personalInfo: {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "555-9876",
    location: "Los Angeles, CA"
  },
  workExperience: [
    {
      jobTitle: "Plumber",
      companyName: "Smith Plumbing",
      location: "LA, CA",
      startDate: "2019-03-01",
      endDate: "2024-10-01",
      isCurrent: false,
      description: "Residential and commercial plumbing services"
    },
    {
      jobTitle: "Apprentice Plumber",
      companyName: "Joe's Plumbing",
      location: "LA, CA",
      startDate: "2017-01-01",
      endDate: "2019-02-28",
      isCurrent: false,
      description: "Learned trade under master plumber"
    }
  ],
  skills: ["Pipe fitting", "Drain cleaning", "Water heater installation", "Gas line repair"],
  education: [
    {
      institutionName: "LA Trade Tech",
      degreeOrProgram: "Plumbing Certificate",
      fieldOfStudy: "Plumbing",
      startDate: "2016-09-01",
      endDate: "2017-06-01",
      isCurrent: false
    }
  ],
  certifications: ["Master Plumber License", "Backflow Certification"]
}
```

## Video Demo Script

1. Start on Dashboard
2. Click "AI Assistant" card
3. Open console and paste test data
4. Watch banner appear
5. Click "Save Resume"
6. Watch redirect to My Resumes
7. Click "View" on new resume
8. Show resume preview
9. Close preview
10. Click "Download"
11. Choose PDF format
12. Show downloaded file
13. Click "Share"
14. Show copied notification
15. Paste share link in new tab
16. Show shared resume page

## Success Criteria

The integration is working correctly if:

1. ✅ Resume data can be saved from chatbot page
2. ✅ Data persists in localStorage
3. ✅ Banner appears when data is ready
4. ✅ Save button successfully saves to database
5. ✅ Resume appears in My Resumes tab
6. ✅ All resume actions work (view, download, share, delete)
7. ✅ Generate New Resume prioritizes chatbot data
8. ✅ Modal appears when no data exists
9. ✅ All notifications display correctly
10. ✅ No console errors occur
