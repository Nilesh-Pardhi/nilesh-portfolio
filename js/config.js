/**
 * ==============================================================================
 * PORTFOLIO CONFIGURATION - NILESH PARDHI
 * ==============================================================================
 * Central configuration file for all personal details, social links,
 * project URLs, document paths, and contact form settings.
 * 
 * Edit the values below to update links throughout the entire portfolio website.
 */

const PORTFOLIO_CONFIG = {
  // Personal & Professional Information
  personal: {
    fullName: "Nilesh Pardhi",
    shortName: "Nilesh",
    monogram: "NP",
    professionalTitle: "Aspiring Data Analyst | Python | SQL | Power BI",
    availabilityBadge: "Available for Data Analyst Internship Opportunities",
    currentFocus: "Data Analytics & Business Intelligence",
    careerGoal: "Data Analyst Internship",
    primaryInterests: "Business Intelligence, KPI Reporting & Data Storytelling",
    
    // File paths
    photoPath: "assets/nilesh-profile.png",
    resumePath: "assets/resume.pdf",
    resumeFileName: "Nilesh_Pardhi_Resume.pdf"
  },

  // Work Experience
  experience: [
    {
      role: "Data Analyst Intern",
      company: "CodSoft",
      duration: "1 Month Internship",
      type: "Remote"
    }
  ],

  // Hackathons & Achievements
  achievements: [
    {
      title: "Top 15 Finalist — Vibe with AI Hackathon",
      event: "Vibe with AI Hackathon",
      rank: "Top 15",
      type: "Hackathon Competition"
    }
  ],

  // Social & Contact Links (Update with your actual profiles)
  socialLinks: {
    // Example: "https://www.linkedin.com/in/your-username"
    linkedin: "https://www.linkedin.com/in/nilesh-pardhi",
    
    // Example: "https://github.com/your-username"
    github: "https://github.com/Nilesh-Pardhi",
    
    // Example: "mailto:your.email@gmail.com"
    email: "nileshpardhi.analytics@gmail.com"
  },

  // Project Links & Metadata
  projects: {
    cricket: {
      id: "cricket-analytics",
      title: "ICC Men's Cricket World Cup 2023 Analysis",
      // Add your repository link here:
      githubUrl: "https://github.com/Nilesh-Pardhi/icc-world-cup-2023-analysis",
      // Set to URL if hosted (e.g., Streamlit/PowerBI public), or keep empty:
      liveDemoUrl: "",
      hasLiveDemo: false
    },
    jobMarket: {
      id: "job-market-intelligence",
      title: "AI Job Market Intelligence Platform",
      // Add your repository link here:
      githubUrl: "https://github.com/Nilesh-Pardhi/ai-job-market-intelligence",
      liveDemoUrl: "",
      hasLiveDemo: false
    },
    superstore: {
      id: "superstore-sales",
      title: "Superstore Sales Analysis Dashboard",
      // Add your repository link here:
      githubUrl: "https://github.com/Nilesh-Pardhi/superstore-sales-analysis",
      // If you publish your Power BI report to web:
      liveDemoUrl: "",
      hasLiveDemo: false
    }
  },

  // Contact Form Handling & Email Delivery
  contactForm: {
    // Primary email delivery provider: "resend" via server endpoint
    service: "resend",
    endpoint: "/api/contact",

    // Configured Recipient Email Address
    recipientEmail: "pardhinilesh0591@gmail.com"
  }
};

// Export to window for vanilla JS access
if (typeof window !== "undefined") {
  window.PORTFOLIO_CONFIG = PORTFOLIO_CONFIG;
}
