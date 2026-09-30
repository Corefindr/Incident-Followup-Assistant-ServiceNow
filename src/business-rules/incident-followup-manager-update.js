(function executeRule(current, previous) {
    var followupUtils = new FollowupUtils();

    if (followupUtils.isAwaitingCaller(current)) {
        followupUtils.ensureFollowupForIncident(current);
        return;
    }

    if (previous && followupUtils.isAwaitingCaller(previous)) {
        followupUtils.closeFollowupForIncident(current, 'Incident left Awaiting Caller state.');
    }
})(current, previous);

