(function executeRule(current, previous) {
    var followupUtils = new FollowupUtils();
    followupUtils.ensureFollowupForIncident(current);
})(current, previous);

