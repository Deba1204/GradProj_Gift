import { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Gift } from 'lucide-react';
import './App.css';

const STEPS = [
  { id: 'welcome', title: 'Gift Genius', subtitle: 'Find the perfect gift in seconds with AI.' },
  { id: 'giftFor', label: 'Who is this gift for?', placeholder: 'e.g., Friend, Mother, Partner' },
  { id: 'interests', label: 'What are their interests?', placeholder: 'e.g., Music, Sports, Tech' },
  { id: 'occasion', label: 'What is the occasion?', placeholder: 'e.g., Birthday, Anniversary' },
  { id: 'budget', label: 'What is your budget limit?', placeholder: 'e.g., Low, 1000-5000 INR, High' },
  { id: 'loading' },
  { id: 'results' }
];

function App() {
  const [stepIdx, setStepIdx] = useState(0);
  const [formData, setFormData] = useState({ giftFor: '', interests: '', occasion: '', budget: '' });
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState('');

  const currentStep = STEPS[stepIdx];

  const handleNext = () => {
    if (['giftFor', 'interests', 'occasion', 'budget'].includes(currentStep.id)) {
        if (!formData[currentStep.id].trim()) {
            setError("Please fill out this field.");
            return;
        }
    }
    setError('');
    
    if (currentStep.id === 'budget') {
        generateIdeas();
    } else {
        setStepIdx(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setStepIdx(prev => prev - 1);
  };

  const resetFlow = () => {
    setFormData({ giftFor: '', interests: '', occasion: '', budget: '' });
    setIdeas([]);
    setError('');
    setStepIdx(0);
  };

  const generateIdeas = async () => {
     setStepIdx(STEPS.findIndex(s => s.id === 'loading'));
     try {
       const res = await fetch('http://localhost:3000/api/recommendations', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
       });
       
       const data = await res.json();
       if (!res.ok) throw new Error(data.error || "Failed to fetch suggestions");
       
       setIdeas(data.ideas || []);
       setStepIdx(STEPS.findIndex(s => s.id === 'results'));
     } catch(err) {
       setError(err.message);
       setStepIdx(STEPS.findIndex(s => s.id === 'budget'));
     }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        
        {/* WELCOME SCREEN */}
        {currentStep.id === 'welcome' && (
           <div style={{ textAlign: 'center' }}>
             <Gift size={64} color="#f472b6" style={{ margin: '0 auto 20px' }} />
             <h1 className="title">{currentStep.title}</h1>
             <p className="subtitle">{currentStep.subtitle}</p>
             <div className="flex-center">
                <button onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Start <ArrowRight size={18} />
                </button>
             </div>
           </div>
        )}

        {/* INPUT SCREENS */}
        {['giftFor', 'interests', 'occasion', 'budget'].includes(currentStep.id) && (
            <div>
                <label className="question-label">{currentStep.label}</label>
                <input 
                   type="text" 
                   autoFocus
                   placeholder={currentStep.placeholder}
                   value={formData[currentStep.id]}
                   onChange={(e) => {
                       setError('');
                       setFormData(prev => ({ ...prev, [currentStep.id]: e.target.value }))
                   }}
                   onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                />
                
                {error && <div className="error-msg">{error}</div>}

                <div className="flex-between">
                    <button onClick={handleBack} style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {currentStep.id === 'budget' ? 'Generate' : 'Next'} 
                        {currentStep.id === 'budget' ? <Sparkles size={18}/> : <ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        )}

        {/* LOADING SCREEN */}
        {currentStep.id === 'loading' && (
            <div className="loading-container">
                <div className="pulsing-orb"></div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Analyzing Profile...</h2>
                <p className="subtitle" style={{ margin: 0 }}>Consulting the AI for the perfect match</p>
            </div>
        )}

        {/* RESULTS SCREEN */}
        {currentStep.id === 'results' && (
            <div>
                <h1 className="title" style={{ fontSize: '1.8rem', marginBottom: '25px' }}>
                    <Sparkles size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px' }}/>
                    Top Suggestions
                </h1>

                {ideas.length === 0 ? (
                    <div className="error-msg">No suggestions could be generated. Try broader terms.</div>
                ) : (
                    <div>
                        {ideas.map((item, idx) => (
                            <div key={idx} className="suggestion-card">
                                <div className="suggestion-name">{item.giftName}</div>
                                <div className="suggestion-reason">{item.reason}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex-center">
                    <button onClick={resetFlow} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                        <RefreshCw size={18} /> Start New Search
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

export default App;
