// TODO: Replace this with mapping obtained from YouTube.
VideoCategory.setCategoryMap({
  0: 'Comedy',
  1: 'Gaming',
  2: 'Entertainment',
  3: 'Education'
});

var numCategories = 4;

var fakeData = generateFakeData(20, numCategories);
console.log(fakeData)
console.log(fakeData.map(video => video.category.toString()));
