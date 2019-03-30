// function start() {
//   // 2. Initialize the JavaScript client library.
//   gapi.client.init({
//     'apiKey': 'AIzaSyDlVZRSyu6K-j6HYabaJblFPtmoFJZQHZA'
//   }).then(function() {
//     // 3. Initialize and make the API request.
//     return gapi.client.request({
//       'path': 'https://www.googleapis.com/youtube/v3/videos',
//       'params': {
//         part: 'contentDetails,snippet',
//         chart: 'mostPopular'
//       }
//     })
//   }).then(function(response) {
//     console.log(response.result);
//   }, function(reason) {
//     console.log('Error: ' + reason.result.error.message);
//   });
// };
// // 1. Load the JavaScript client library.
// gapi.load('client', start);