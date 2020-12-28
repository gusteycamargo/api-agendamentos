module.exports = function formatDateString (string) {
    const input = string.split("-");  // ex input "2010-01-18"
    return input[2]+ "/" +input[1]+ "/" +input[0]; 
}