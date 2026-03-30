import { useState, useMemo } from 'react';
import type { Stakeholder } from '../lib/supabase';
import StakeholderCard from './StakeholderCard';
import StakeholderForm from './StakeholderForm';
import StakeholderDetail from './StakeholderDetail';

interface DirectoryProps {
  stakeholders: Stakeholder[];
  onAdd: (stakeholder: Omit<Stakeholder, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<Stakeholder>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export default function Directory({ stakeholders, onAdd, onUpdate, onDelete }: DirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [initiativeFilter, setInitiativeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);

  const allInitiatives = useMemo(() => {
    return [...new Set(stakeholders.flatMap(s => s.initiatives))].sort();
  }, [stakeholders]);

  const filteredStakeholders = useMemo(() => {
    return stakeholders.filter(s => {
      const matchesSearch = !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = !tierFilter || s.tier === tierFilter;
      const matchesInitiative = !initiativeFilter || s.initiatives.includes(initiativeFilter);
      return matchesSearch && matchesTier && matchesInitiative;
    });
  }, [stakeholders, searchQuery, tierFilter, initiativeFilter]);

  const handleAddClick = () => {
    setEditingStakeholder(null);
    setShowForm(true);
    setSelectedStakeholder(null);
  };

  const handleEditClick = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setShowForm(true);
    setSelectedStakeholder(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStakeholder(null);
  };

  const handleCardClick = (stakeholder: Stakeholder) => {
    if (selectedStakeholder?.id === stakeholder.id) {
      setSelectedStakeholder(null);
    } else {
      setSelectedStakeholder(stakeholder);
      setShowForm(false);
    }
  };

  return (
    <div>
      {showForm && (
        <StakeholderForm
          stakeholder={editingStakeholder}
          onSave={async (data) => {
            const success = editingStakeholder
              ? await onUpdate(editingStakeholder.id, data)
              : await onAdd(data);
            if (success) handleFormClose();
            return success;
          }}
          onCancel={handleFormClose}
        />
      )}

      <div className="bar">
        <input
          placeholder="Search name, role, or org..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
          <option value="">All tiers</option>
          <option value="champion">Champions</option>
          <option value="supporter">Supporters</option>
          <option value="neutral">Neutral</option>
          <option value="skeptic">Skeptics</option>
        </select>
        <select value={initiativeFilter} onChange={(e) => setInitiativeFilter(e.target.value)}>
          <option value="">All initiatives</option>
          {allInitiatives.map(init => (
            <option key={init} value={init}>{init}</option>
          ))}
        </select>
        <button className="abtn" onClick={handleAddClick}>
          + Add Stakeholder
        </button>
      </div>

      {filteredStakeholders.length === 0 ? (
        <div className="nr">No stakeholders match your filters.</div>
      ) : (
        <div className="grid">
          {filteredStakeholders.map(stakeholder => (
            <StakeholderCard
              key={stakeholder.id}
              stakeholder={stakeholder}
              isSelected={selectedStakeholder?.id === stakeholder.id}
              onClick={() => handleCardClick(stakeholder)}
            />
          ))}
        </div>
      )}

      {selectedStakeholder && (
        <StakeholderDetail
          stakeholder={selectedStakeholder}
          onEdit={() => handleEditClick(selectedStakeholder)}
          onDelete={async () => {
            const success = await onDelete(selectedStakeholder.id);
            if (success) setSelectedStakeholder(null);
          }}
          onClose={() => setSelectedStakeholder(null)}
        />
      )}
    </div>
  );
}
