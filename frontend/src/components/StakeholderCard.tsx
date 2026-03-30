import type { Stakeholder } from '../lib/supabase';
import { getInitials, getAvatarStyle, getTierBadgeClass, getTierLabel } from '../utils/helpers';

interface StakeholderCardProps {
  stakeholder: Stakeholder;
  isSelected: boolean;
  onClick: () => void;
}

export default function StakeholderCard({ stakeholder, isSelected, onClick }: StakeholderCardProps) {
  return (
    <div className={`card ${isSelected ? 'sel' : ''}`} onClick={onClick}>
      <div className="ctop">
        <div className="av" style={getAvatarStyle(stakeholder.id)}>
          {getInitials(stakeholder.name)}
        </div>
        <div>
          <div className="cn">{stakeholder.name}</div>
          <div className="cr">{stakeholder.role}</div>
          <div className="co">{stakeholder.organization}</div>
        </div>
      </div>
      <span className={`bx ${getTierBadgeClass(stakeholder.tier)}`}>
        {getTierLabel(stakeholder.tier)}
      </span>
      {stakeholder.initiatives.length > 0 && (
        <div className="tags">
          {stakeholder.initiatives.map(initiative => (
            <span key={initiative} className="tag">{initiative}</span>
          ))}
        </div>
      )}
      <div className="csc">
        <div className="ci">
          <span className="cil">Influence</span>
          <span className="civ">{stakeholder.influence}</span>
        </div>
        <div className="ci">
          <span className="cil">Interest</span>
          <span className="civ">{stakeholder.interest}</span>
        </div>
      </div>
    </div>
  );
}
