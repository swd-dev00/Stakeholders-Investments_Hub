import type { Stakeholder } from '../lib/supabase';
import { getInitials, getAvatarStyle, getTierBadgeClass, getTierLabel } from '../utils/helpers';

interface StakeholderDetailProps {
  stakeholder: Stakeholder;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function StakeholderDetail({ stakeholder, onEdit, onDelete, onClose }: StakeholderDetailProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${stakeholder.name}?`)) {
      onDelete();
    }
  };

  return (
    <div className="det">
      <div className="dh">
        <div className="av" style={{ ...getAvatarStyle(stakeholder.id), width: '52px', height: '52px', fontSize: '17px' }}>
          {getInitials(stakeholder.name)}
        </div>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 500, color: 'var(--text)' }}>
            {stakeholder.name}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '2px' }}>
            {stakeholder.role} · {stakeholder.organization}
          </div>
          <span className={`bx ${getTierBadgeClass(stakeholder.tier)}`}>
            {getTierLabel(stakeholder.tier)}
          </span>
        </div>
      </div>
      <div className="dg">
        <span className="dl">Email</span>
        <span className="dv">{stakeholder.email || '—'}</span>
        <span className="dl">Influence</span>
        <span className="dv">{stakeholder.influence}/10</span>
        <span className="dl">Interest</span>
        <span className="dv">{stakeholder.interest}/10</span>
        <span className="dl">Initiatives</span>
        <span className="dv">{stakeholder.initiatives.join(', ') || '—'}</span>
        {stakeholder.notes && (
          <>
            <span className="dl">Notes</span>
            <span className="dv">{stakeholder.notes}</span>
          </>
        )}
      </div>
      <div className="dact">
        <button className="be" onClick={onEdit}>Edit</button>
        <button className="bd" onClick={handleDelete}>Delete</button>
        <button className="bx2" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
