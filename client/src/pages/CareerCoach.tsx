import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import { 
  ArrowLeft, Sparkles, Target, TrendingUp, DollarSign, 
  MapPin, Clock, Award, ChevronRight, Users, Building2, BookOpen,
  MessageSquare, CheckCircle
} from 'lucide-react'

const CAREER_PATHS = {
  'software-engineer': {
    title: 'Software Engineer',
    levels: ['Junior (0-2 yrs)', 'Mid-Level (2-5 yrs)', 'Senior (5-8 yrs)', 'Staff (8-12 yrs)', 'Principal (12+ yrs)'],
    skills: ['Programming', 'System Design', 'Problem Solving', 'Communication'],
    salary: { low: 60000, mid: 120000, high: 250000 },
  },
  'frontend-developer': {
    title: 'Frontend Developer',
    levels: ['Junior Frontend', 'Frontend Developer', 'Senior Frontend', 'Staff Engineer', 'Principal Engineer'],
    skills: ['React/Vue/Angular', 'CSS/Animation', 'Performance', 'Accessibility'],
    salary: { low: 55000, mid: 110000, high: 220000 },
  },
  'backend-developer': {
    title: 'Backend Developer',
    levels: ['Junior Backend', 'Backend Developer', 'Senior Backend', 'Staff Engineer', 'Principal Engineer'],
    skills: ['APIs', 'Databases', 'Security', 'Scalability'],
    salary: { low: 60000, mid: 120000, high: 240000 },
  },
  'fullstack-developer': {
    title: 'Full Stack Developer',
    levels: ['Junior Full Stack', 'Full Stack Developer', 'Senior Full Stack', 'Tech Lead', 'Principal Engineer'],
    skills: ['Frontend + Backend', 'Databases', 'DevOps', 'Architecture'],
    salary: { low: 55000, mid: 115000, high: 230000 },
  },
  'devops-engineer': {
    title: 'DevOps Engineer',
    levels: ['Junior DevOps', 'DevOps Engineer', 'Senior DevOps', 'Staff DevOps', 'Platform Architect'],
    skills: ['CI/CD', 'Cloud Infrastructure', 'Kubernetes', 'Automation'],
    salary: { low: 65000, mid: 130000, high: 260000 },
  },
  'data-engineer': {
    title: 'Data Engineer',
    levels: ['Junior DE', 'Data Engineer', 'Senior DE', 'Lead DE', 'Data Architect'],
    skills: ['ETL', 'SQL', 'Spark/Hadoop', 'Data Modeling'],
    salary: { low: 70000, mid: 135000, high: 270000 },
  },
  'ml-engineer': {
    title: 'Machine Learning Engineer',
    levels: ['Junior MLE', 'ML Engineer', 'Senior MLE', 'Staff MLE', 'Principal MLE'],
    skills: ['Deep Learning', 'ML Ops', 'Python', 'Cloud ML'],
    salary: { low: 80000, mid: 150000, high: 300000 },
  },
  'product-manager': {
    title: 'Product Manager',
    levels: ['Associate PM', 'PM', 'Senior PM', 'Director', 'VP Product'],
    skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Stakeholder Management'],
    salary: { low: 70000, mid: 140000, high: 300000 },
  },
  'product-designer': {
    title: 'Product Designer',
    levels: ['Junior Designer', 'Product Designer', 'Senior Designer', 'Design Lead', 'Design Director'],
    skills: ['UI/UX', 'User Research', 'Figma', 'Design Systems'],
    salary: { low: 55000, mid: 110000, high: 220000 },
  },
  'ux-researcher': {
    title: 'UX Researcher',
    levels: ['Junior UX Researcher', 'UX Researcher', 'Senior UX Researcher', 'Lead Researcher', 'Head of Research'],
    skills: ['User Interviews', 'Usability Testing', 'Data Analysis', 'Research Ops'],
    salary: { low: 50000, mid: 100000, high: 200000 },
  },
  'data-scientist': {
    title: 'Data Scientist',
    levels: ['Junior DS', 'Data Scientist', 'Senior DS', 'Lead DS', 'Chief Data Officer'],
    skills: ['Machine Learning', 'Statistics', 'Programming', 'Communication'],
    salary: { low: 70000, mid: 130000, high: 280000 },
  },
  'data-analyst': {
    title: 'Data Analyst',
    levels: ['Junior Analyst', 'Data Analyst', 'Senior Analyst', 'Lead Analyst', 'Analytics Manager'],
    skills: ['SQL', 'Tableau/PowerBI', 'Python', 'Business Intelligence'],
    salary: { low: 45000, mid: 85000, high: 160000 },
  },
  'business-analyst': {
    title: 'Business Analyst',
    levels: ['Junior BA', 'Business Analyst', 'Senior BA', 'Lead BA', 'Analytics Director'],
    skills: ['Requirements', 'SQL', 'Process Modeling', 'Stakeholder Management'],
    salary: { low: 50000, mid: 95000, high: 180000 },
  },
  'project-manager': {
    title: 'Project Manager',
    levels: ['Associate PM', 'Project Manager', 'Senior PM', 'Program Manager', 'VP Operations'],
    skills: ['Agile/Scrum', 'Risk Management', 'Stakeholder Management', 'Planning'],
    salary: { low: 55000, mid: 110000, high: 220000 },
  },
  'scrum-master': {
    title: 'Scrum Master',
    levels: ['Junior SM', 'Scrum Master', 'Senior SM', 'Lead SM', 'Agile Coach'],
    skills: ['Scrum/Kanban', 'Coaching', 'Facilitation', 'Conflict Resolution'],
    salary: { low: 50000, mid: 100000, high: 190000 },
  },
  'qa-engineer': {
    title: 'QA Engineer',
    levels: ['Junior QA', 'QA Engineer', 'Senior QA', 'Lead QA', 'QA Manager'],
    skills: ['Test Automation', 'Selenium/Cypress', 'API Testing', 'Performance Testing'],
    salary: { low: 45000, mid: 90000, high: 170000 },
  },
  'security-engineer': {
    title: 'Security Engineer',
    levels: ['Junior Security', 'Security Engineer', 'Senior Security', 'Security Lead', 'CISO'],
    skills: ['Penetration Testing', 'SIEM', 'Compliance', 'AppSec'],
    salary: { low: 70000, mid: 140000, high: 280000 },
  },
  'cloud-engineer': {
    title: 'Cloud Engineer',
    levels: ['Junior Cloud', 'Cloud Engineer', 'Senior Cloud', 'Cloud Architect', 'Cloud Director'],
    skills: ['AWS/Azure/GCP', 'Infrastructure as Code', 'Networking', 'Security'],
    salary: { low: 65000, mid: 130000, high: 250000 },
  },
  'solutions-architect': {
    title: 'Solutions Architect',
    levels: ['Associate SA', 'Solutions Architect', 'Senior SA', 'Lead SA', 'Chief Architect'],
    skills: ['Cloud Architecture', 'Enterprise Integration', 'Technical Sales', 'Consulting'],
    salary: { low: 80000, mid: 160000, high: 320000 },
  },
  'technical-writer': {
    title: 'Technical Writer',
    levels: ['Junior TW', 'Technical Writer', 'Senior TW', 'Lead TW', 'Head of Documentation'],
    skills: ['Documentation', 'API Docs', 'Markdown', 'Content Strategy'],
    salary: { low: 45000, mid: 85000, high: 160000 },
  },
  'marketing-manager': {
    title: 'Marketing Manager',
    levels: ['Marketing Coordinator', 'Marketing Manager', 'Senior Marketing Manager', 'Director', 'VP Marketing'],
    skills: ['Digital Marketing', 'Content Strategy', 'Analytics', 'Brand Management'],
    salary: { low: 40000, mid: 80000, high: 180000 },
  },
  'sales-representative': {
    title: 'Sales Representative',
    levels: ['SDR', 'Sales Rep', 'Senior Sales', 'Account Executive', 'Sales Director'],
    skills: ['Prospecting', 'Negotiation', 'CRM', 'Product Knowledge'],
    salary: { low: 35000, mid: 75000, high: 200000 },
  },
  'consultant': {
    title: 'Consultant',
    levels: ['Associate', 'Consultant', 'Senior Consultant', 'Manager', 'Partner'],
    skills: ['Analysis', 'Client Management', 'Domain Expertise', 'Presentation'],
    salary: { low: 50000, mid: 110000, high: 300000 },
  },
  'hr-specialist': {
    title: 'HR Specialist',
    levels: ['HR Coordinator', 'HR Specialist', 'Senior HR', 'HR Manager', 'HR Director'],
    skills: ['Recruiting', 'Employee Relations', 'Compliance', 'HRIS'],
    salary: { low: 40000, mid: 80000, high: 170000 },
  },
  'recruiter': {
    title: 'Technical Recruiter',
    levels: ['Recruiting Coordinator', 'Recruiter', 'Senior Recruiter', 'Lead Recruiter', 'Head of Recruiting'],
    skills: ['Sourcing', 'Interviewing', 'Negotiation', 'Employer Branding'],
    salary: { low: 45000, mid: 95000, high: 200000 },
  },
  'engineering-manager': {
    title: 'Engineering Manager',
    levels: ['Tech Lead', 'Engineering Manager', 'Senior EM', 'Director', 'VP Engineering'],
    skills: ['Team Management', 'Technical Vision', 'Hiring', 'Process'],
    salary: { low: 90000, mid: 180000, high: 350000 },
  },
  'vp-engineering': {
    title: 'VP of Engineering',
    levels: ['Director', 'VP Engineering', 'SVP Engineering', 'CTO', 'Chief Engineering Officer'],
    skills: ['Strategy', 'Leadership', 'Architecture', 'Board Communication'],
    salary: { low: 150000, mid: 280000, high: 500000 },
  },
}

const SKILL_SUGGESTIONS: Record<string, { skill: string; importance: string; reason: string }[]> = {
  'software-engineer': [
    { skill: 'System Design', importance: 'high', reason: 'Critical for senior roles and interviews' },
    { skill: 'Cloud Platforms (AWS/GCP)', importance: 'high', reason: 'Essential for modern development' },
    { skill: 'Database Design', importance: 'medium', reason: 'Every app needs data persistence' },
    { skill: 'Testing & CI/CD', importance: 'medium', reason: 'Shows engineering maturity' },
    { skill: 'Leadership', importance: 'high', reason: 'Needed for staff+ roles' },
  ],
  'frontend-developer': [
    { skill: 'React/Vue/Angular', importance: 'high', reason: 'Most sought-after framework skills' },
    { skill: 'Performance Optimization', importance: 'high', reason: 'Critical for user experience' },
    { skill: 'TypeScript', importance: 'high', reason: 'Industry standard now' },
    { skill: 'CSS Architecture', importance: 'medium', reason: 'Scalable styling matters' },
    { skill: 'Testing', importance: 'medium', reason: 'E2E and unit testing skills' },
  ],
  'backend-developer': [
    { skill: 'API Design (REST/GraphQL)', importance: 'high', reason: 'Core backend skill' },
    { skill: 'Database Optimization', importance: 'high', reason: 'Performance is key' },
    { skill: 'Microservices', importance: 'high', reason: 'Modern architecture pattern' },
    { skill: 'Message Queues', importance: 'medium', reason: 'Async processing' },
    { skill: 'Security Best Practices', importance: 'high', reason: 'Critical for any role' },
  ],
  'fullstack-developer': [
    { skill: 'Node.js/Python', importance: 'high', reason: 'Popular full-stack languages' },
    { skill: 'Database Design', importance: 'high', reason: 'Full stack data handling' },
    { skill: 'Cloud Basics', importance: 'medium', reason: 'Deployment and scaling' },
    { skill: 'Git/Version Control', importance: 'medium', reason: 'Essential for any dev' },
  ],
  'devops-engineer': [
    { skill: 'Kubernetes', importance: 'high', reason: 'Container orchestration standard' },
    { skill: 'Terraform/CloudFormation', importance: 'high', reason: 'Infrastructure as Code' },
    { skill: 'AWS/GCP/Azure', importance: 'high', reason: 'Cloud platforms' },
    { skill: 'CI/CD Pipelines', importance: 'high', reason: 'Automation is key' },
    { skill: 'Monitoring/Logging', importance: 'medium', reason: 'Observability' },
  ],
  'data-engineer': [
    { skill: 'Apache Spark', importance: 'high', reason: 'Big data processing' },
    { skill: 'SQL Expert', importance: 'high', reason: 'Foundation for data work' },
    { skill: 'Airflow/Dagster', importance: 'medium', reason: 'Workflow orchestration' },
    { skill: 'Data Modeling', importance: 'high', reason: 'Foundation skill' },
    { skill: 'Cloud Data Platforms', importance: 'medium', reason: 'Snowflake, BigQuery, Redshift' },
  ],
  'ml-engineer': [
    { skill: 'Deep Learning', importance: 'high', reason: 'Neural networks' },
    { skill: 'ML Ops', importance: 'high', reason: 'Deploying models to production' },
    { skill: 'Python/PyTorch/TensorFlow', importance: 'high', reason: 'ML toolkit' },
    { skill: 'Cloud ML Services', importance: 'medium', reason: 'AWS SageMaker, GCP AI' },
    { skill: 'Feature Engineering', importance: 'high', reason: 'Model performance' },
  ],
  'product-manager': [
    { skill: 'SQL & Analytics', importance: 'high', reason: 'Data-driven decision making' },
    { skill: 'User Research', importance: 'high', reason: 'Understand your users' },
    { skill: 'Roadmapping', importance: 'medium', reason: 'Strategic planning' },
    { skill: 'A/B Testing', importance: 'medium', reason: 'Experimental mindset' },
    { skill: 'Technical Literacy', importance: 'high', reason: 'Work effectively with engineers' },
  ],
  'product-designer': [
    { skill: 'Figma', importance: 'high', reason: 'Industry standard design tool' },
    { skill: 'Design Systems', importance: 'high', reason: 'Scalable design' },
    { skill: 'User Research', importance: 'high', reason: 'Data-driven design' },
    { skill: 'Prototyping', importance: 'medium', reason: 'Animation and interaction' },
    { skill: 'Accessibility', importance: 'medium', reason: 'Inclusive design' },
  ],
  'ux-researcher': [
    { skill: 'User Interviews', importance: 'high', reason: 'Primary research method' },
    { skill: 'Usability Testing', importance: 'high', reason: 'Validate designs' },
    { skill: 'Survey Design', importance: 'medium', reason: 'Quantitative insights' },
    { skill: 'Data Analysis', importance: 'high', reason: 'Make sense of findings' },
  ],
  'data-scientist': [
    { skill: 'Machine Learning', importance: 'high', reason: 'Core skill' },
    { skill: 'Python/R', importance: 'high', reason: 'Programming languages' },
    { skill: 'Statistics', importance: 'high', reason: 'Foundation of data science' },
    { skill: 'SQL', importance: 'high', reason: 'Data querying' },
    { skill: 'Visualization', importance: 'medium', reason: 'Communicate insights' },
  ],
  'data-analyst': [
    { skill: 'SQL', importance: 'high', reason: 'Data extraction' },
    { skill: 'Tableau/PowerBI', importance: 'high', reason: 'Visualization tools' },
    { skill: 'Excel', importance: 'medium', reason: 'Foundation skill' },
    { skill: 'Python/R', importance: 'medium', reason: 'Analysis automation' },
    { skill: 'Business Acumen', importance: 'high', reason: 'Context matters' },
  ],
  'business-analyst': [
    { skill: 'Requirements Gathering', importance: 'high', reason: 'Core BA skill' },
    { skill: 'SQL', importance: 'high', reason: 'Data analysis' },
    { skill: 'Process Modeling', importance: 'high', reason: 'Understand workflows' },
    { skill: 'JIRA/Confluence', importance: 'medium', reason: 'Tool proficiency' },
  ],
  'project-manager': [
    { skill: 'PMP/CAPM', importance: 'high', reason: 'Certification helps' },
    { skill: 'Agile/Scrum', importance: 'high', reason: 'Methodology expertise' },
    { skill: 'Risk Management', importance: 'high', reason: 'Critical for success' },
    { skill: 'Stakeholder Management', importance: 'high', reason: 'Keep everyone aligned' },
  ],
  'scrum-master': [
    { skill: 'CSM/PSM Certification', importance: 'high', reason: 'Industry certification' },
    { skill: 'Facilitation', importance: 'high', reason: 'Run effective meetings' },
    { skill: 'Conflict Resolution', importance: 'medium', reason: 'Team dynamics' },
    { skill: 'JIRA/Agile Tools', importance: 'medium', reason: 'Tool proficiency' },
  ],
  'qa-engineer': [
    { skill: 'Selenium/Cypress', importance: 'high', reason: 'Test automation' },
    { skill: 'API Testing', importance: 'high', reason: 'Backend validation' },
    { skill: 'JavaScript/Python', importance: 'medium', reason: 'Test scripting' },
    { skill: 'CI/CD', importance: 'medium', reason: 'Automated testing' },
  ],
  'security-engineer': [
    { skill: 'CISSP/CEH', importance: 'high', reason: 'Industry certification' },
    { skill: 'Penetration Testing', importance: 'high', reason: 'Find vulnerabilities' },
    { skill: 'SIEM Tools', importance: 'medium', reason: 'Security monitoring' },
    { skill: 'Cloud Security', importance: 'high', reason: 'Modern infrastructure' },
  ],
  'cloud-engineer': [
    { skill: 'AWS Solutions Architect', importance: 'high', reason: 'Top cloud certification' },
    { skill: 'Kubernetes', importance: 'high', reason: 'Container orchestration' },
    { skill: 'Terraform', importance: 'high', reason: 'Infrastructure as Code' },
    { skill: 'Networking', importance: 'medium', reason: 'Cloud fundamentals' },
  ],
  'solutions-architect': [
    { skill: 'Cloud Certifications', importance: 'high', reason: 'AWS/Azure/GCP' },
    { skill: 'Enterprise Architecture', importance: 'high', reason: 'System design' },
    { skill: 'Technical Sales', importance: 'medium', reason: 'Customer facing' },
    { skill: 'Communication', importance: 'high', reason: 'Present to stakeholders' },
  ],
  'engineering-manager': [
    { skill: 'Technical Vision', importance: 'high', reason: 'Lead technical direction' },
    { skill: 'Hiring/Onboarding', importance: 'high', reason: 'Build the team' },
    { skill: '1:1s & Coaching', importance: 'high', reason: 'Develop people' },
    { skill: 'Process & Delivery', importance: 'medium', reason: 'Ship software' },
  ],
}

const INTERVIEW_TIPS = [
  { title: 'Research the Company', description: 'Spend 30 minutes on company blog, recent news, and Glassdoor reviews.', icon: Building2 },
  { title: 'Prepare STAR Stories', description: 'Have 5-7 stories ready covering leadership, failure, conflict, and success.', icon: MessageSquare },
  { title: 'Practice Out Loud', description: 'Record yourself or practice with a friend to improve delivery.', icon: MessageSquare },
  { title: 'Prepare Questions', description: 'Have 3-5 thoughtful questions for the interviewer.', icon: MessageSquare },
  { title: 'Plan Your Outfit', description: 'Dress one level above the company culture.', icon: Users },
]

interface RoadmapItem {
  title: string
  description: string
  duration: string
  resources: string[]
  completed: boolean
}

export default function CareerCoach() {
  const [targetRole, setTargetRole] = useState('software-engineer')
  const [currentLevel, setCurrentLevel] = useState(0)
  const [targetLevel, setTargetLevel] = useState(2)
  const [salary, setSalary] = useState(80000)
  const [location, setLocation] = useState('San Francisco, CA')
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([])
  const [showRoadmap, setShowRoadmap] = useState(false)

  const careerPath = CAREER_PATHS[targetRole as keyof typeof CAREER_PATHS]
  
  const generateRoadmap = () => {
    const items: RoadmapItem[] = [
      {
        title: 'Audit Current Skills',
        description: 'Complete skills assessment and identify gaps',
        duration: '1 week',
        resources: ['Skill assessment quiz', 'Peer feedback'],
        completed: false,
      },
      {
        title: 'Build Foundation',
        description: 'Master core skills required for next level',
        duration: '1-2 months',
        resources: ['Online courses', 'Practice projects'],
        completed: false,
      },
      {
        title: 'Gain Experience',
        description: 'Take on stretch assignments at work',
        duration: '3-6 months',
        resources: ['Internal opportunities', 'Side projects'],
        completed: false,
      },
      {
        title: 'Update Personal Brand',
        description: 'LinkedIn, portfolio, technical blog',
        duration: '2 weeks',
        resources: ['LinkedIn optimization', 'GitHub portfolio'],
        completed: false,
      },
      {
        title: 'Internal Pitch',
        description: 'Discuss promotion with manager',
        duration: '1 month',
        resources: ['1:1 conversations', 'Performance data'],
        completed: false,
      },
      {
        title: 'Apply Externally',
        description: 'Start interviewing for next role',
        duration: '1-2 months',
        resources: ['Job applications', 'Interview practice'],
        completed: false,
      },
    ]
    setRoadmap(items)
    setShowRoadmap(true)
  }

  const currentSalaryRange = careerPath?.salary || { low: 50000, mid: 100000, high: 200000 }
  const nextLevelSalary = targetLevel > currentLevel 
    ? currentSalaryRange.mid + (targetLevel - currentLevel) * 20000
    : currentSalaryRange.mid

  return (
    <div className="p-6 lg:p-8">
      <Link to="/app" className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      
      <h1 className="text-2xl font-bold text-white">AI Career Coach</h1>
      <p className="mt-1 text-[var(--color-muted)]">Personalized career roadmap, skill suggestions, and guidance</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Target className="h-5 w-5 text-[var(--color-primary)]" />
            Career Profile
          </h2>
          
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Target Role</label>
              <select 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
              >
                {Object.entries(CAREER_PATHS).map(([key, val]) => (
                  <option key={key} value={key}>{val.title}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">Current Level</label>
                <select 
                  value={currentLevel} 
                  onChange={(e) => setCurrentLevel(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
                >
                  {careerPath?.levels.map((level, i) => (
                    <option key={i} value={i}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Target Level</label>
                <select 
                  value={targetLevel} 
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
                >
                  {careerPath?.levels.map((level, i) => (
                    <option key={i} value={i}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white">Current Salary</label>
              <div className="mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[var(--color-muted)]" />
                <input 
                  type="number" 
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white">Location</label>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--color-muted)]" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
                />
              </div>
            </div>
            
            <Button variant="primary" className="w-full" onClick={generateRoadmap}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Career Roadmap
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Salary Projection
          </h2>
          
          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-[var(--color-surface)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-muted)]">Current</span>
                <span className="text-lg font-bold text-white">${salary.toLocaleString()}</span>
              </div>
              <ProgressBar value={Math.min(100, (salary / currentSalaryRange.high) * 100)} className="mt-2" />
            </div>
            
            <div className="rounded-lg bg-[var(--color-primary-muted)]/20 p-4 border border-[var(--color-primary)]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-muted)]">Target (at {careerPath?.levels[targetLevel]})</span>
                <span className="text-lg font-bold text-green-400">${nextLevelSalary.toLocaleString()}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                <TrendingUp className="h-3 w-3" />
                +${(nextLevelSalary - salary).toLocaleString()} ({(Math.round((nextLevelSalary - salary) / salary * 100))}%)
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-[var(--color-surface)] p-2">
                <p className="text-[var(--color-muted)]">Market Low</p>
                <p className="font-medium text-white">${currentSalaryRange.low.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-[var(--color-surface)] p-2">
                <p className="text-[var(--color-muted)]">Market Mid</p>
                <p className="font-medium text-white">${currentSalaryRange.mid.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-[var(--color-surface)] p-2">
                <p className="text-[var(--color-muted)]">Market High</p>
                <p className="font-medium text-white">${currentSalaryRange.high.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {showRoadmap && (
        <Card className="mt-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
            Your Career Roadmap
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {careerPath?.levels[currentLevel]} → {careerPath?.levels[targetLevel]}
          </p>
          
          <div className="mt-6 space-y-4">
            {roadmap.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-500' : 'bg-[var(--color-primary)]'}`}>
                    {item.completed ? <CheckCircle className="h-4 w-4 text-white" /> : <span className="text-sm text-white">{i + 1}</span>}
                  </div>
                  {i < roadmap.length - 1 && <div className="h-12 w-0.5 bg-[var(--color-border)]" />}
                </div>
                <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">{item.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                        <Clock className="h-3 w-3" /> {item.duration}
                      </div>
                    </div>
                    <button className="text-[var(--color-primary)] hover:text-white">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Award className="h-5 w-5 text-[var(--color-accent)]" />
            Skill Recommendations
          </h2>
          <div className="mt-4 space-y-3">
            {(SKILL_SUGGESTIONS[targetRole as keyof typeof SKILL_SUGGESTIONS] || SKILL_SUGGESTIONS['software-engineer']).map((item, i) => (
              <div key={i} className="rounded-lg bg-[var(--color-surface)] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{item.skill}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.importance === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.importance}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-muted)]">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <BookOpen className="h-5 w-5 text-green-400" />
            Interview Preparation Tips
          </h2>
          <div className="mt-4 space-y-3">
            {INTERVIEW_TIPS.map((tip, i) => (
              <div key={i} className="flex gap-3 rounded-lg bg-[var(--color-surface)] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                  <tip.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{tip.title}</h3>
                  <p className="text-xs text-[var(--color-muted)]">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 bg-gradient-to-r from-[var(--color-primary-muted)]/30 to-[var(--color-accent)]/30 border-[var(--color-primary)]/30">
        <div className="flex items-start gap-4">
          <Sparkles className="h-8 w-8 shrink-0 text-[var(--color-accent)]" />
          <div>
            <h2 className="text-lg font-semibold text-white">AI Career Advice</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Based on your profile, you're on a solid path to transition from {careerPath?.levels[currentLevel]} to {careerPath?.levels[targetLevel]}. 
              Focus on developing {careerPath?.skills[0]} and {careerPath?.skills[1]} to accelerate your growth. 
              Consider targeting companies in {location} where salaries for this role typically range ${currentSalaryRange.mid.toLocaleString()} - ${currentSalaryRange.high.toLocaleString()}.
            </p>
            <div className="mt-4 flex gap-3">
              <Link to="/app/interview">
                <Button variant="primary">Practice Interviews</Button>
              </Link>
              <Link to="/app/resume">
                <Button variant="secondary">Optimize Resume</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
