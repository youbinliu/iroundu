var isNullOrEmity = function(value){
    return value === null || value.length === 0
}

var isEmail = function(value){
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)
}