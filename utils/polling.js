function poll(method, interval){
    var pollTimer = setInterval(method, interval);
    return pollTimer;
}
function endPoll(pollTimer){
    clearInterval(pollTimer)
}

module.exports = {
    poll,
    endPoll
}