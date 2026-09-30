(function executeRule(current, previous) {
    var followupUtils = new FollowupUtils();
    current.setValue('status', followupUtils.calculateStatus(current));
})(current, previous);

