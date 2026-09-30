(function executeRule(current, previous) {
    if (!current.getValue('followup')) {
        gs.addErrorMessage('A follow-up attempt must be linked to a follow-up record.');
        current.setAbortAction(true);
        return;
    }

    if (!current.getValue('outcome')) {
        gs.addErrorMessage('Select an outcome before saving the follow-up attempt.');
        current.setAbortAction(true);
        return;
    }

    if (!current.getValue('summary')) {
        gs.addErrorMessage('Add a short summary before saving the follow-up attempt.');
        current.setAbortAction(true);
    }
})(current, previous);

