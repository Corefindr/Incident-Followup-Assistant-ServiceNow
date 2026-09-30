import type { FollowupSummary } from '../team-service';

type Props = {
  followup: FollowupSummary;
};

export function FollowupCard({ followup }: Props) {
  return (
    <article className={`followup-card followup-card--${followup.status}`}>
      <div>
        <span className="followup-card__incident">{followup.incidentNumber}</span>
        <span className="followup-card__status">{followup.status}</span>
      </div>
      <h3>{followup.shortDescription}</h3>
      <dl>
        <div>
          <dt>Owner</dt>
          <dd>{followup.assignedTo}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>{followup.dueAt}</dd>
        </div>
        <div>
          <dt>Age</dt>
          <dd>{followup.ageDays} days</dd>
        </div>
        <div>
          <dt>Attempts</dt>
          <dd>{followup.attemptCount}</dd>
        </div>
      </dl>
    </article>
  );
}

