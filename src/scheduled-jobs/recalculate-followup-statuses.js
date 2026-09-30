(function runScheduledJob() {
    var followupUtils = new FollowupUtils();
    var gr = new GlideRecord('x_scope_incident_followup');
    gr.addQuery('active', true);
    gr.query();

    while (gr.next()) {
        followupUtils.recalculateFollowup(gr);
    }
})();

