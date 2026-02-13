import { SKILLS_DB, ACTION_VERBS, BUZZWORDS } from '../data/skills.js';

// ============================================
// EXTRACT SKILLS FROM TEXT
// ============================================
export const extractSkills = (text) => {
  if (!text) return [];
  const textLower = text.toLowerCase();
  const foundSkills = [];
  
  SKILLS_DB.forEach(skill => {
    if (textLower.includes(skill)) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)];
};

// ============================================
// ANALYZE ACTION VERBS
// ============================================
export const analyzeActionVerbs = (text) => {
  if (!text) return { strongCount: 0, weakCount: 0, strongVerbs: [], weakVerbs: [] };
  
  const textLower = text.toLowerCase();
  const words = textLower.split(/\s+/);
  
  let strongCount = 0;
  let weakCount = 0;
  const foundStrong = [];
  const foundWeak = [];
  
  words.forEach(word => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    
    if (ACTION_VERBS.strong.includes(cleanWord)) {
      strongCount++;
      if (!foundStrong.includes(cleanWord)) foundStrong.push(cleanWord);
    }
    
    if (ACTION_VERBS.weak.includes(cleanWord)) {
      weakCount++;
      if (!foundWeak.includes(cleanWord)) foundWeak.push(cleanWord);
    }
  });
  
  return {
    strongCount,
    weakCount,
    strongVerbs: foundStrong.slice(0, 8),
    weakVerbs: foundWeak.slice(0, 5)
  };
};

// ============================================
// CHECK FOR QUANTIFIED ACHIEVEMENTS
// ============================================
export const hasQuantifiedAchievements = (text) => {
  if (!text) return false;
  const patterns = [
    /\d+%/, /\d+\s?percent/, /\d+x/, /\$\s?\d+/,
    /increased by \d+/, /decreased by \d+/, /reduced by \d+/,
    /\d+\s?(users|customers|clients|people|employees)/,
    /\d+\s?(hours|days|weeks|months)/,
    /\d+\s?(projects|features|products|releases)/
  ];
  
  return patterns.some(pattern => pattern.test(text.toLowerCase()));
};

// ============================================
// DETECT BUZZWORDS
// ============================================
export const detectBuzzwords = (text) => {
  if (!text) return { count: 0, buzzwords: [] };
  const textLower = text.toLowerCase();
  const found = [];
  
  BUZZWORDS.forEach(word => {
    if (textLower.includes(word)) {
      found.push(word);
    }
  });
  
  return {
    count: found.length,
    buzzwords: found.slice(0, 5)
  };
};

// ============================================
// CHECK RESUME SECTIONS
// ============================================
export const checkResumeSections = (text) => {
  if (!text) {
    return {
      hasEmail: false,
      hasPhone: false,
      hasLinkedIn: false,
      hasGitHub: false,
      hasEducation: false,
      hasExperience: false,
      hasProjects: false,
      hasSkills: false,
      hasCertifications: false
    };
  }
  
  const textLower = text.toLowerCase();
  
  return {
    hasEmail: /\S+@\S+\.\S+/.test(text),
    hasPhone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/.test(text),
    hasLinkedIn: /linkedin\.com\/in\//.test(textLower),
    hasGitHub: /github\.com\//.test(textLower),
    hasEducation: /education|university|college|bachelor|master|b\.tech|m\.tech/.test(textLower),
    hasExperience: /experience|work history|employment|intern/.test(textLower),
    hasProjects: /projects/.test(textLower),
    hasSkills: /skills|technologies|competencies/.test(textLower),
    hasCertifications: /certifications|certificates/.test(textLower)
  };
};

// ============================================
// CALCULATE MATCH SCORE WITH JOB DESCRIPTION
// ============================================
export const calculateMatchScore = (resumeSkills, jobDescription) => {
  if (!jobDescription || !resumeSkills) {
    return { score: 0, matchedSkills: [], missingSkills: [] };
  }
  
  const jdSkills = extractSkills(jobDescription);
  
  if (jdSkills.length === 0) return { score: 0, matchedSkills: [], missingSkills: [] };
  
  const matchedSkills = resumeSkills.filter(skill => jdSkills.includes(skill));
  const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
  
  const score = Math.round((matchedSkills.length / jdSkills.length) * 100);
  
  return {
    score,
    matchedSkills: matchedSkills.slice(0, 15),
    missingSkills: missingSkills.slice(0, 15)
  };
};

// ============================================
// GENERATE ATS CHECKLIST
// ============================================
export const generateATSChecklist = (analysis) => {
  const checklist = [];
  
  // Contact Information
  checklist.push({ name: 'Email Address', passed: analysis.sections?.hasEmail || false, category: 'Contact' });
  checklist.push({ name: 'Phone Number', passed: analysis.sections?.hasPhone || false, category: 'Contact' });
  checklist.push({ name: 'LinkedIn URL', passed: analysis.sections?.hasLinkedIn || false, category: 'Contact' });
  
  // Essential Sections
  checklist.push({ name: 'Education Section', passed: analysis.sections?.hasEducation || false, category: 'Sections' });
  checklist.push({ name: 'Experience Section', passed: analysis.sections?.hasExperience || false, category: 'Sections' });
  checklist.push({ name: 'Projects Section', passed: analysis.sections?.hasProjects || false, category: 'Sections' });
  checklist.push({ name: 'Skills Section', passed: analysis.sections?.hasSkills || false, category: 'Sections' });
  checklist.push({ name: 'GitHub Profile', passed: analysis.sections?.hasGitHub || false, category: 'Sections' });
  
  // Content Quality
  checklist.push({ name: 'Quantified Achievements', passed: analysis.hasQuantified || false, category: 'Content' });
  checklist.push({ name: 'Strong Action Verbs (3+)', passed: (analysis.actionVerbs?.strongCount || 0) > 3, category: 'Content' });
  checklist.push({ name: 'No Weak Verbs', passed: (analysis.actionVerbs?.weakCount || 0) < 3, category: 'Content' });
  checklist.push({ name: 'No Buzzwords', passed: (analysis.buzzwords?.count || 0) === 0, category: 'Content' });
  checklist.push({ name: 'Certifications', passed: analysis.sections?.hasCertifications || false, category: 'Content' });
  
  // Skills
  checklist.push({ name: 'Technical Skills (8+)', passed: (analysis.skills?.length || 0) >= 8, category: 'Skills' });
  
  return checklist;
};

// ============================================
// GENERATE SUGGESTIONS
// ============================================
export const generateSuggestions = (analysis, missingSkills) => {
  const suggestions = [];
  
  if (missingSkills && missingSkills.length > 0) {
    suggestions.push({
      category: 'Skills Gap',
      priority: 'High',
      message: `Add these missing skills: ${missingSkills.slice(0, 5).join(', ')}`,
      action: 'Take free courses on Coursera or YouTube'
    });
  }
  
  if (!analysis.sections?.hasLinkedIn) {
    suggestions.push({
      category: 'Contact',
      priority: 'High',
      message: 'Add your LinkedIn profile URL',
      action: 'Create a LinkedIn profile and add the link to your resume'
    });
  }
  
  if (!analysis.sections?.hasGitHub) {
    suggestions.push({
      category: 'Portfolio',
      priority: 'Medium',
      message: 'Add your GitHub profile to showcase projects',
      action: 'Create a GitHub account and add your repositories'
    });
  }
  
  if (!analysis.hasQuantified) {
    suggestions.push({
      category: 'Achievements',
      priority: 'High',
      message: 'Add numbers and metrics to demonstrate impact',
      action: 'Use format: "Increased X by Y%" or "Reduced Z by N hours"'
    });
  }
  
  return suggestions.slice(0, 5);
};
