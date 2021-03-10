// テスト
(function() {
  kintone.events.on('app.record.index.show', function(event) {
    console.log(event);
  });
})();
