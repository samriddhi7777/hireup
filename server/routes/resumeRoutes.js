import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import {
  extractSkills,
  analyzeActionVerbs,
  hasQuantifiedAchievements,
  detectBuzzwords,
  checkResumeSections,
  calculateMatchScore,
  generateATSChecklist,
  generateSuggestions
} from '../services/resumeAnalyzer.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Extract text from PDF
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to parse PDF file');
  }
}

// Extract text from DOCX
async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse DOCX file');
  }
}

// Analyze resume endpoint - NO next() function used!
router.post('/analyze', protect, upload.single('resume'), async (req, res) => {
  try {
    console.log('📄 Resume analysis started');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const { jobDescription } = req.body;
    let resumeText = '';

    // Extract text based on file type
    const fileExt = req.file.originalname.toLowerCase().split('.').pop();
    
    if (fileExt === 'pdf') {
      resumeText = await extractTextFromPDF(req.file.buffer);
    } else if (fileExt === 'docx') {
      resumeText = await extractTextFromDOCX(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Only PDF and DOCX files are supported' });
    }

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ error: 'Could not extract text from resume' });
    }

    console.log('✅ Text extracted, length:', resumeText.length);

    // Perform analysis
    const skills = extractSkills(resumeText);
    const actionVerbs = analyzeActionVerbs(resumeText);
    const hasQuantified = hasQuantifiedAchievements(resumeText);
    const buzzwords = detectBuzzwords(resumeText);
    const sections = checkResumeSections(resumeText);
    const wordCount = resumeText.split(/\s+/).length;

    let matchScore = 0;
    let matchedSkills = [];
    let missingSkills = [];

    if (jobDescription && jobDescription.length > 10) {
      const match = calculateMatchScore(skills, jobDescription);
      matchScore = match.score;
      matchedSkills = match.matchedSkills;
      missingSkills = match.missingSkills;
    }

    const analysis = {
      skills,
      actionVerbs,
      hasQuantified,
      buzzwords,
      sections,
      matchScore,
      wordCount
    };

    const checklist = generateATSChecklist(analysis);
    const suggestions = generateSuggestions(analysis, missingSkills);
    const passedChecks = checklist.filter(item => item.passed).length;
    const atsScore = Math.round((passedChecks / checklist.length) * 100);

    // Save to user history
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        user.resumes = user.resumes || [];
        user.resumes.push({
          fileName: req.file.originalname,
          date: new Date(),
          score: atsScore,
          totalChecksPassed: passedChecks,
          wordCount,
          matchScore,
          skills: skills.slice(0, 15),
          missingSkills: missingSkills.slice(0, 15)
        });
        await user.save();
      }
    } catch (saveError) {
      console.error('Error saving to history:', saveError);
      // Continue even if save fails
    }

    res.json({
      success: true,
      data: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        wordCount,
        skills: skills.slice(0, 20),
        actionVerbs,
        hasQuantifiedResults: hasQuantified,
        buzzwords,
        sections,
        matchScore,
        matchedSkills: matchedSkills.slice(0, 15),
        missingSkills: missingSkills.slice(0, 15),
        checklist,
        totalChecks: checklist.length,
        passedChecks,
        atsScore,
        suggestions
      }
    });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

export default router;
