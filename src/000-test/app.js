import kintoneUtility from "kintoneUtility";

// テスト
(function() {

    kintone.events.on('app.record.index.show', function(event) {
        console.log(event);

        kintoneUtility.rest.getAllRecordsByQuery({
            app: 247
            // query: '',
            // fields: ['String', 'Number'],
            // isGuest: false
        }).then(function(response) {
            console.log(response);
        }).catch(function(error) {
            console.log(error);
        });
    });

})();
