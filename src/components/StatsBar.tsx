import { Stakeholder } from '../lib/supabase';

interface StatsBarProps {
  stakeholders: Stakeholder[];
}

export default function StatsBar({ stakeholders }: StatsBarProps) {
  const totalStakeholders = stakeholders.length;
  const champions = stakeholders.filter(s => s.tier === 'champion').length;
  const initiatives = new Set(stakeholders.flatMap(s => s.initiatives)).size;
  const avgInfluence = stakeholders.length
    ? Math.round(stakeholders.reduce((sum, s) => sum + s.influence, 0) / stakeholders.length)
    : 0;

  return (
    <div className="srow">
      <div className="sc">
        <div className="sl">Total stakeholders</div>
        <div className="sv">{totalStakeholders}</div>
      </div>
      <div className="sc">
        <div className="sl">Champions</div>
        <div className="sv">{champions}</div>
      </div>
      <div className="sc">
        <div className="sl">Initiatives</div>
        <div className="sv">{initiatives}</div>
      </div>
      <div className="sc">
        <div className="sl">Avg influence</div>
        <div className="sv">{avgInfluence}</div>
      </div>
    </div>
  );
}
