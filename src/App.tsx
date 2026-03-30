import { useState, useEffect } from 'react';
import { supabase, Stakeholder } from './lib/supabase';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import Tabs from './components/Tabs';
import Directory from './components/Directory';
import InfluenceMap from './components/InfluenceMap';
import Initiatives from './components/Initiatives';
import './App.css';

type TabType = 'directory' | 'map' | 'initiatives';

function App() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('directory');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStakeholders();
  }, []);

  async function loadStakeholders() {
    try {
      const { data, error } = await supabase
        .from('stakeholders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStakeholders(data || []);
    } catch (error) {
      console.error('Error loading stakeholders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addStakeholder(stakeholder: Omit<Stakeholder, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('stakeholders')
        .insert([stakeholder])
        .select()
        .single();

      if (error) throw error;
      setStakeholders([data, ...stakeholders]);
      return true;
    } catch (error) {
      console.error('Error adding stakeholder:', error);
      return false;
    }
  }

  async function updateStakeholder(id: string, updates: Partial<Stakeholder>) {
    try {
      const { data, error } = await supabase
        .from('stakeholders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setStakeholders(stakeholders.map(s => s.id === id ? data : s));
      return true;
    } catch (error) {
      console.error('Error updating stakeholder:', error);
      return false;
    }
  }

  async function deleteStakeholder(id: string) {
    try {
      const { error } = await supabase
        .from('stakeholders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setStakeholders(stakeholders.filter(s => s.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
      return false;
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading stakeholders...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <StatsBar stakeholders={stakeholders} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'directory' && (
        <Directory
          stakeholders={stakeholders}
          onAdd={addStakeholder}
          onUpdate={updateStakeholder}
          onDelete={deleteStakeholder}
        />
      )}

      {activeTab === 'map' && (
        <InfluenceMap stakeholders={stakeholders} />
      )}

      {activeTab === 'initiatives' && (
        <Initiatives stakeholders={stakeholders} />
      )}
    </div>
  );
}

export default App;
