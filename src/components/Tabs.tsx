type TabType = 'directory' | 'map' | 'initiatives';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="tabs">
      <button
        className={`tb ${activeTab === 'directory' ? 'on' : ''}`}
        onClick={() => onTabChange('directory')}
      >
        Directory
      </button>
      <button
        className={`tb ${activeTab === 'map' ? 'on' : ''}`}
        onClick={() => onTabChange('map')}
      >
        Influence Map
      </button>
      <button
        className={`tb ${activeTab === 'initiatives' ? 'on' : ''}`}
        onClick={() => onTabChange('initiatives')}
      >
        Initiatives
      </button>
    </div>
  );
}
