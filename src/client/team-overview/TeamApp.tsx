import { useEffect, useMemo, useState } from 'react';
import { FollowupCard } from './components/FollowupCard';
import { calculateMetrics, fetchTeamFollowups, type FollowupSummary } from './team-service';
import './TeamApp.css';

export default function TeamApp() {
  const [followups, setFollowups] = useState<FollowupSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | FollowupSummary['status']>('all');

  useEffect(() => {
    fetchTeamFollowups().then(setFollowups);
  }, []);

  const metrics = useMemo(() => calculateMetrics(followups), [followups]);
  const visibleFollowups = followups.filter((item) => statusFilter === 'all' || item.status === statusFilter);

  return (
    <main className="team-app">
      <header className="team-app__header">
        <div>
          <p>ServiceNow ITSM</p>
          <h1>Team Follow-up Overview</h1>
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
          <option value="all">All follow-ups</option>
          <option value="upcoming">Upcoming</option>
          <option value="due">Due</option>
          <option value="overdue">Overdue</option>
        </select>
      </header>

      <section className="metric-grid" aria-label="Follow-up metrics">
        <div>
          <span>Upcoming</span>
          <strong>{metrics.upcoming}</strong>
        </div>
        <div>
          <span>Due</span>
          <strong>{metrics.due}</strong>
        </div>
        <div>
          <span>Overdue</span>
          <strong>{metrics.overdue}</strong>
        </div>
        <div>
          <span>Repeat cycles</span>
          <strong>{metrics.repeatCycles}</strong>
        </div>
        <div>
          <span>Average age</span>
          <strong>{metrics.averageAgeDays}d</strong>
        </div>
      </section>

      <section className="followup-list" aria-label="Follow-up queue">
        {visibleFollowups.map((followup) => (
          <FollowupCard key={followup.id} followup={followup} />
        ))}
      </section>
    </main>
  );
}

export const serviceNowUiPageMetadata = {
  category: 'general',
  name: 'Team Follow-up Overview',
};

