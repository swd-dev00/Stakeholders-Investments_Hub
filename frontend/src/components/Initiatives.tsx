import { useMemo } from 'react';
import type { Stakeholder } from '../lib/supabase';
import { getInitials, getAvatarStyle, getTierBadgeClass, getTierLabel } from '../utils/helpers';

interface InitiativesProps {
  stakeholders: Stakeholder[];
}

export default function Initiatives({ stakeholders }: InitiativesProps) {
  const initiativeGroups = useMemo(() => {
    const groups = new Map<string, Stakeholder[]>();

    stakeholders.forEach(stakeholder => {
      stakeholder.initiatives.forEach(initiative => {
        if (!groups.has(initiative)) {
          groups.set(initiative, []);
        }
        groups.get(initiative)!.push(stakeholder);
      });
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([initiative, members]) => ({ initiative, members }));
  }, [stakeholders]);

  if (initiativeGroups.length === 0) {
    return (
      <div className="nr">
        No initiatives defined yet. Add stakeholders with initiative tags to populate this view.
      </div>
    );
  }

  return (
    <div>
      {initiativeGroups.map(({ initiative, members }) => (
        <div key={initiative} className="ic">
          <div className="it">
            {initiative}
            <span className="icn">
              {members.length} stakeholder{members.length !== 1 ? 's' : ''}
            </span>
          </div>
          {members.map(stakeholder => (
            <div key={stakeholder.id} className="im">
              <div className="av" style={{ ...getAvatarStyle(stakeholder.id), width: '30px', height: '30px', fontSize: '10px', flexShrink: 0 }}>
                {getInitials(stakeholder.name)}
              </div>
              <span style={{ fontWeight: 500 }}>{stakeholder.name}</span>
              <span className={`bx ${getTierBadgeClass(stakeholder.tier)}`}>
                {getTierLabel(stakeholder.tier)}
              </span>
              <span className="mr">
                {stakeholder.role} · {stakeholder.organization}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
