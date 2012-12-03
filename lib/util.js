exports.isNullOrEmity = function(value){
    return !value || value.length === 0
}

exports.isEmail = function(value){
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)
}