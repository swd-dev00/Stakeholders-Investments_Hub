import { useState, useEffect } from 'react';
import type { Stakeholder } from '../lib/supabase';

interface StakeholderFormProps {
  stakeholder: Stakeholder | null;
  onSave: (data: Omit<Stakeholder, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onCancel: () => void;
}

export default function StakeholderForm({ stakeholder, onSave, onCancel }: StakeholderFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<'champion' | 'supporter' | 'neutral' | 'skeptic'>('champion');
  const [initiativesText, setInitiativesText] = useState('');
  const [influence, setInfluence] = useState(5);
  const [interest, setInterest] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (stakeholder) {
      setName(stakeholder.name);
      setRole(stakeholder.role);
      setOrganization(stakeholder.organization);
      setEmail(stakeholder.email);
      setTier(stakeholder.tier);
      setInitiativesText(stakeholder.initiatives.join(', '));
      setInfluence(stakeholder.influence);
      setInterest(stakeholder.interest);
      setNotes(stakeholder.notes);
    }
  }, [stakeholder]);

  const handleSubmit = async () => {
    if (!name.trim() || !role.trim() || !organization.trim()) {
      alert('Name, role, and organization are required.');
      return;
    }

    const initiatives = initiativesText
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    const success = await onSave({
      name: name.trim(),
      role: role.trim(),
      organization: organization.trim(),
      email: email.trim(),
      tier,
      initiatives,
      influence: Math.min(10, Math.max(1, influence)),
      interest: Math.min(10, Math.max(1, interest)),
      notes: notes.trim(),
    });

    if (success) {
      setName('');
      setRole('');
      setOrganization('');
      setEmail('');
      setTier('champion');
      setInitiativesText('');
      setInfluence(5);
      setInterest(5);
      setNotes('');
    }
  };

  return (
    <div className="fp">
      <div className="ft">{stakeholder ? 'Edit Stakeholder' : 'Add Stakeholder'}</div>
      <div className="fr">
        <div>
          <label className="fl">Full name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Jane Smith"
          />
        </div>
        <div>
          <label className="fl">Role / Title *</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="AI Policy Director"
          />
        </div>
      </div>
      <div className="fr">
        <div>
          <label className="fl">Organization *</label>
          <input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="European Commission"
          />
        </div>
        <div>
          <label className="fl">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@org.com"
          />
        </div>
      </div>
      <div className="fr">
        <div>
          <label className="fl">Tier</label>
          <select value={tier} onChange={(e) => setTier(e.target.value as any)}>
            <option value="champion">Champion</option>
            <option value="supporter">Supporter</option>
            <option value="neutral">Neutral</option>
            <option value="skeptic">Skeptic</option>
          </select>
        </div>
        <div>
          <label className="fl">Initiatives (comma-separated)</label>
          <input
            value={initiativesText}
            onChange={(e) => setInitiativesText(e.target.value)}
            placeholder="G-BALO, Glass Substrate Protocol"
          />
        </div>
      </div>
      <div className="fr">
        <div>
          <label className="fl">Influence (1–10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={influence}
            onChange={(e) => setInfluence(parseInt(e.target.value) || 5)}
          />
        </div>
        <div>
          <label className="fl">Interest (1–10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={interest}
            onChange={(e) => setInterest(parseInt(e.target.value) || 5)}
          />
        </div>
      </div>
      <div className="fr1">
        <label className="fl">Notes</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Context, connections, action items..."
        />
      </div>
      <div className="fac">
        <button className="bsv" onClick={handleSubmit}>
          Save Stakeholder
        </button>
        <button className="bcn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
