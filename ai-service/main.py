print("MAIN.PY STARTED", flush=True)
import os
import json
import time
import fitz

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from google import genai
from google.genai import types

# RAG router
print("Starting CareerOS AI imports...", flush=True)

from rag_service import router as rag_router

print("RAG router imported successfully!", flush=True)


# =====================================
# 1. ENVIRONMENT CONFIGURATION
# =====================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing in .env file")


# =====================================
# 2. FASTAPI CONFIGURATION
# =====================================

app = FastAPI(
    title="CareerOS AI Service",
    version="2.3.0"
)

# Register RAG endpoints
app.include_router(rag_router)


# =====================================
# 3. GEMINI CONFIGURATION
# =====================================

client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-3.1-flash-lite"


# =====================================
# 4. REQUEST MODELS
# =====================================

class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(
        min_length=50,
        max_length=40000
    )


class JobMatchRequest(BaseModel):
    resume_text: str = Field(
        min_length=50,
        max_length=40000
    )

    job_description: str = Field(
        min_length=30,
        max_length=20000
    )


# Fixed: job_description removed
class ResumeComparisonRequest(BaseModel):
    old_resume_text: str = Field(
        min_length=50,
        max_length=40000
    )

    new_resume_text: str = Field(
        min_length=50,
        max_length=40000
    )


# =====================================
# 5. GEMINI HELPER
# =====================================

def generate_ai_response(prompt):

    response = None

    for attempt in range(3):

        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json"
                )
            )

            break

        except Exception as error:

            if "503" in str(error) and attempt < 2:
                wait_time = 2 ** (attempt + 1)

                print(
                    f"Gemini unavailable. Retrying in {wait_time}s..."
                )

                time.sleep(wait_time)
                continue

            raise error

    if response is None or not response.text:
        raise ValueError("Empty response received from Gemini")

    return json.loads(response.text)


# =====================================
# 6. HOME ROUTE
# =====================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "CareerOS AI Service is running!"
    }


# =====================================
# 7. HEALTH CHECK
# =====================================

@app.get("/health")
def health_check():

    return {
        "success": True,
        "service": "CareerOS AI",
        "status": "healthy"
    }


# =====================================
# 8. PDF TEXT EXTRACTION
# =====================================

@app.post("/extract-resume")
async def extract_resume(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    try:

        content = await file.read()

        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="PDF size must be below 5MB"
            )

        pdf = fitz.open(
            stream=content,
            filetype="pdf"
        )

        extracted_text = ""

        for page in pdf:
            extracted_text += page.get_text() + "\n"

        pdf.close()

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in PDF"
            )

        return {
            "success": True,
            "filename": file.filename,
            "total_characters": len(extracted_text),
            "extracted_text": extracted_text
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =====================================
# 9. AI RESUME ANALYSIS
# =====================================

@app.post("/analyze-resume")
def analyze_resume(data: ResumeAnalysisRequest):

    prompt = f"""
You are an expert technical recruiter
and professional resume analyst.

Analyze the following resume carefully.

RESUME:
{data.resume_text}

Return ONLY valid JSON with this exact structure:

{{
    "summary": "Professional summary of the candidate",
    "experience_level": "Fresher / Junior / Mid-level / Senior",
    "technical_skills": ["Python", "JavaScript"],
    "soft_skills": ["Communication", "Teamwork"],
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "missing_skills": ["Skill 1", "Skill 2"],
    "improvement_suggestions": ["Suggestion 1", "Suggestion 2"],
    "ats_score": 75
}}

RULES:
1. ATS score must be an integer between 0 and 100.
2. Do not invent qualifications or experience.
3. Identify only skills supported by the resume.
4. Missing skills should be relevant to the candidate's career direction.
5. Give practical improvement suggestions.
6. If information is unavailable, mention that clearly.
"""

    try:

        analysis = generate_ai_response(prompt)

        score = analysis.get("ats_score")

        if (
            not isinstance(score, int)
            or isinstance(score, bool)
            or not 0 <= score <= 100
        ):
            raise ValueError("Invalid ATS score returned by AI")

        return {
            "success": True,
            "message": "Resume analyzed successfully",
            "analysis": analysis
        }

    except json.JSONDecodeError:

        raise HTTPException(
            status_code=502,
            detail="AI returned an invalid JSON response"
        )

    except Exception as error:

        print("AI Analysis Error:", str(error))

        raise HTTPException(
            status_code=502,
            detail=f"AI analysis failed: {str(error)}"
        )


# =====================================
# 10. JOB DESCRIPTION MATCHING
# =====================================

@app.post("/match-job")
def match_job(data: JobMatchRequest):

    prompt = f"""
You are an expert technical recruiter
and career intelligence analyst.

Compare the candidate's resume with the
provided job description.

CANDIDATE RESUME:
{data.resume_text}

JOB DESCRIPTION:
{data.job_description}

Return ONLY valid JSON with this exact structure:

{{
    "match_score": 75,
    "match_summary": "Explanation of how well the candidate matches this job",
    "matched_skills": ["Python", "React"],
    "missing_skills": ["Docker", "AWS"],
    "relevant_experience": ["Relevant experience from resume"],
    "skill_gaps": ["Important skill gap"],
    "improvement_suggestions": [
        "Practical suggestion 1",
        "Practical suggestion 2"
    ],
    "recommendation": "Short recommendation for the candidate"
}}

RULES:
1. Match score must be an integer between 0 and 100.
2. Compare actual resume information with job requirements.
3. Do not invent skills, qualifications or experience.
4. Matched skills must be supported by the resume.
5. Missing skills must come from the job description.
6. Consider skills, experience and qualifications.
7. Give practical and specific improvement suggestions.
8. Be honest. Do not give an artificially high score.
9. If information is unavailable, mention it clearly.
"""

    try:

        result = generate_ai_response(prompt)

        score = result.get("match_score")

        if (
            not isinstance(score, int)
            or isinstance(score, bool)
            or not 0 <= score <= 100
        ):
            raise ValueError("Invalid match score returned by AI")

        return {
            "success": True,
            "message": "Job matching completed successfully",
            "result": result
        }

    except json.JSONDecodeError:

        raise HTTPException(
            status_code=502,
            detail="AI returned an invalid JSON response"
        )

    except Exception as error:

        print("Job Matching Error:", str(error))

        raise HTTPException(
            status_code=502,
            detail=f"Job matching failed: {str(error)}"
        )


# =====================================
# 11. AI RESUME VERSION COMPARISON
# =====================================

@app.post("/compare-resumes")
def compare_resumes(data: ResumeComparisonRequest):

    prompt = f"""
You are an expert technical recruiter
and professional resume comparison analyst.

Compare these two versions of the same candidate's resume.

OLD RESUME:
{data.old_resume_text}

NEW RESUME:
{data.new_resume_text}

Return ONLY valid JSON with this exact structure:

{{
    "overall_summary": "Overall comparison summary",
    "improvements": [
        "Improvement 1",
        "Improvement 2"
    ],
    "new_skills": [
        "New skill 1",
        "New skill 2"
    ],
    "removed_skills": [
        "Removed skill 1"
    ],
    "new_information": [
        "New information added"
    ],
    "removed_information": [
        "Information removed"
    ],
    "old_ats_score": 65,
    "new_ats_score": 80,
    "recommendation": "Which version is better and why"
}}

RULES:
1. Compare only information actually present in the resumes.
2. Never invent skills, projects or experience.
3. ATS scores must be integers between 0 and 100.
4. Scores are estimates, not actual ATS test results.
5. Identify meaningful improvements in the new resume.
6. Mention removed information honestly.
7. If no changes exist in a category, return an empty array.
8. Give a clear and practical recommendation.
"""

    try:

        result = generate_ai_response(prompt)

        for score_key in ["old_ats_score", "new_ats_score"]:

            score = result.get(score_key)

            if (
                not isinstance(score, int)
                or isinstance(score, bool)
                or not 0 <= score <= 100
            ):
                raise ValueError(
                    f"Invalid {score_key} returned by AI"
                )

        return {
            "success": True,
            "message": "Resume comparison completed successfully",
            "result": result
        }

    except json.JSONDecodeError:

        raise HTTPException(
            status_code=502,
            detail="AI returned an invalid JSON response"
        )

    except Exception as error:

        print("Resume Comparison Error:", str(error))

        raise HTTPException(
            status_code=502,
            detail=f"Resume comparison failed: {str(error)}"
        )
