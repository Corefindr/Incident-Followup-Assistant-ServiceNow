var FollowupUtils = Class.create();
FollowupUtils.prototype = {
    initialize: function () {
        this.FOLLOWUP_TABLE = 'x_scope_incident_followup';
        this.ATTEMPT_TABLE = 'x_scope_followup_attempt';
        this.DEFAULT_DUE_HOURS = parseInt(gs.getProperty('x_scope.followup.default_due_hours', '24'), 10);
        this.DUE_WINDOW_HOURS = parseInt(gs.getProperty('x_scope.followup.due_window_hours', '4'), 10);
        this.WORK_NOTES_PREFIX = gs.getProperty('x_scope.followup.work_notes_prefix', 'Follow-up Assistant');
    },

    isAwaitingCaller: function (incidentGr) {
        if (!incidentGr || !incidentGr.isValidRecord()) {
            return false;
        }

        var state = String(incidentGr.getValue('state') || '');
        var holdReason = String(incidentGr.getValue('hold_reason') || '');

        return state === 'on_hold' && holdReason === 'awaiting_caller';
    },

    ensureFollowupForIncident: function (incidentGr) {
        if (!this.isAwaitingCaller(incidentGr)) {
            return null;
        }

        var followupGr = this._findActiveFollowup(incidentGr.getUniqueValue());
        if (followupGr) {
            this._incrementRepeatCycle(followupGr);
            return followupGr.getUniqueValue();
        }

        followupGr = new GlideRecord(this.FOLLOWUP_TABLE);
        followupGr.initialize();
        followupGr.setValue('incident', incidentGr.getUniqueValue());
        followupGr.setValue('assigned_to', incidentGr.getValue('assigned_to'));
        followupGr.setValue('assignment_group', incidentGr.getValue('assignment_group'));
        followupGr.setValue('active', true);
        followupGr.setValue('attempt_count', 0);
        followupGr.setValue('repeat_cycle_count', 1);
        followupGr.setValue('due_at', this._nextDueAt());
        followupGr.setValue('status', this.calculateStatus(followupGr));
        var followupId = followupGr.insert();

        this.writeIncidentWorkNote(incidentGr, 'Follow-up record created for Awaiting Caller monitoring.');
        return followupId;
    },

    calculateStatus: function (followupGr) {
        if (!followupGr.getValue('active')) {
            return 'cancelled';
        }

        var dueAt = new GlideDateTime(followupGr.getValue('due_at'));
        var now = new GlideDateTime();
        if (dueAt.before(now)) {
            return 'overdue';
        }

        var dueWindow = new GlideDateTime(now);
        dueWindow.addSeconds(this.DUE_WINDOW_HOURS * 60 * 60);
        if (dueAt.before(dueWindow)) {
            return 'due';
        }

        return 'upcoming';
    },

    recalculateFollowup: function (followupGr) {
        if (!followupGr || !followupGr.isValidRecord()) {
            return;
        }

        followupGr.setValue('status', this.calculateStatus(followupGr));
        followupGr.setValue('age_days', this._ageDays(followupGr));
        followupGr.update();
    },

    recordAttempt: function (attemptGr) {
        if (!attemptGr || !attemptGr.isValidRecord()) {
            return;
        }

        var followupGr = attemptGr.followup.getRefRecord();
        if (!followupGr || !followupGr.isValidRecord()) {
            return;
        }

        var attemptCount = parseInt(followupGr.getValue('attempt_count') || '0', 10) + 1;
        followupGr.setValue('attempt_count', attemptCount);
        followupGr.setValue('last_attempt_at', new GlideDateTime());
        followupGr.setValue('caller_response_outcome', attemptGr.getValue('outcome'));
        followupGr.setValue('status', this.calculateStatus(followupGr));
        followupGr.update();

        var incidentGr = followupGr.incident.getRefRecord();
        this.writeIncidentWorkNote(incidentGr, this._attemptWorkNote(attemptGr, attemptCount));
    },

    closeFollowupForIncident: function (incidentGr, reason) {
        var followupGr = this._findActiveFollowup(incidentGr.getUniqueValue());
        if (!followupGr) {
            return;
        }

        followupGr.setValue('active', false);
        followupGr.setValue('status', 'complete');
        followupGr.setValue('notes', reason || 'Follow-up completed.');
        followupGr.update();
    },

    writeIncidentWorkNote: function (incidentGr, message) {
        if (!incidentGr || !incidentGr.isValidRecord()) {
            return;
        }

        incidentGr.work_notes = '[' + this.WORK_NOTES_PREFIX + '] ' + message;
        incidentGr.update();
    },

    _findActiveFollowup: function (incidentSysId) {
        var gr = new GlideRecord(this.FOLLOWUP_TABLE);
        gr.addQuery('incident', incidentSysId);
        gr.addQuery('active', true);
        gr.setLimit(1);
        gr.query();
        return gr.next() ? gr : null;
    },

    _incrementRepeatCycle: function (followupGr) {
        var cycles = parseInt(followupGr.getValue('repeat_cycle_count') || '0', 10) + 1;
        followupGr.setValue('repeat_cycle_count', cycles);
        followupGr.setValue('due_at', this._nextDueAt());
        followupGr.setValue('status', this.calculateStatus(followupGr));
        followupGr.update();
    },

    _nextDueAt: function () {
        var dueAt = new GlideDateTime();
        dueAt.addSeconds(this.DEFAULT_DUE_HOURS * 60 * 60);
        return dueAt;
    },

    _ageDays: function (followupGr) {
        var created = new GlideDateTime(followupGr.getValue('sys_created_on'));
        var now = new GlideDateTime();
        return Math.floor(gs.dateDiff(created, now, true) / 86400);
    },

    _attemptWorkNote: function (attemptGr, attemptCount) {
        return [
            'Follow-up attempt #' + attemptCount,
            'Type: ' + attemptGr.getDisplayValue('attempt_type'),
            'Outcome: ' + attemptGr.getDisplayValue('outcome'),
            'Summary: ' + attemptGr.getValue('summary')
        ].join('\n');
    },

    type: 'FollowupUtils'
};

