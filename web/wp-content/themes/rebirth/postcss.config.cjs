module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-combine-duplicated-selectors'),
    require('postcss-sort-media-queries'),
  ],
};
